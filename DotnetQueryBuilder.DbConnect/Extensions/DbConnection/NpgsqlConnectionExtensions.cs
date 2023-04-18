namespace DotnetQueryBuilder.DbConnect;

using System.Data;
using Npgsql;
using Dapper;
using DotnetQueryBuilder.Core;
using Newtonsoft.Json;

public static class NpgsqlConnectionExtensions
{
    public static readonly string[] ExcludeDbs = new string[] {
        "postgres",
        "template0",
        "template1"
    };

    public static readonly string GetTablesQuery = @"
            WITH tables_cte
            AS (
                SELECT 
                table_catalog || '.' || table_schema || '.' || table_name as Id,
                table_catalog as Catalog,
                table_schema as Schema,
                table_name as Table,
                table_type as TableType
                FROM information_schema.tables
                WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
                AND table_type IN('BASE TABLE','VIEW')
            ),
            columns_cte
            AS (
                SELECT
                    c.column_name AS ColumnName,
                    c.data_type AS NativeType,
                    c.table_name as TableName,
                    c.table_schema as TableSchema,
                    c.column_default AS ColumnDefault,
                    CASE WHEN c.is_nullable = 'NO' THEN false ELSE true END AS IsNullable,
                    c.character_maximum_length AS CharacterMaximumLength,
                    c.numeric_precision AS NumericPrecision,
                    c.numeric_scale AS NumericScale,
                    c.datetime_precision AS DateTimePrecision,
                    c.ordinal_position AS OrdinalPosition,
                    CASE WHEN c.column_default IS NOT NULL THEN true ELSE false END AS HasDefault,
                    CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN true ELSE false END AS IsPrimaryKey,
                    CASE WHEN tc.constraint_type = 'FOREIGN KEY' THEN true ELSE false END AS IsForeignKey,
                    tc.constraint_name AS ForeignKeyName,
                    kcu.ordinal_position AS ForeignKeySequence,
                    ccu.table_schema AS ForeignKeyReferenceSchema,
                    ccu.table_name AS ForeignKeyReferenceTable,
                    ccu.column_name AS ForeignKeyReferenceColumn
                FROM
                    information_schema.columns c
                    LEFT JOIN information_schema.key_column_usage kcu
                        ON c.table_schema = kcu.table_schema
                        AND c.table_name = kcu.table_name
                        AND c.column_name = kcu.column_name
                    LEFT JOIN information_schema.table_constraints tc
                        ON kcu.constraint_schema = tc.constraint_schema
                        AND kcu.constraint_name = tc.constraint_name
                    LEFT JOIN information_schema.constraint_column_usage ccu
                        ON tc.constraint_schema = ccu.constraint_schema
                        AND tc.constraint_name = ccu.constraint_name
                )
            SELECT
                t.*,
                c.*
            FROM tables_cte as t
            INNER JOIN columns_cte as c
                ON t.Schema = c.TableSchema
                AND t.Table = c.TableName";

    public static ConnectionSchemaDto GetConnectionSchema(this NpgsqlConnection connection, string connectionId)
    {
        var dbs = connection.GetSchema("Databases").AsEnumerable()
            .Select(r => r["database_name"])
            .Where(n => !ExcludeDbs.Contains(n.ToString()));

        var catalogs = dbs.Select(c =>
            new ConnectionCatalogDto
            {
                Id = connectionId,
                Catalog = c.ToString(),
                ConnectionId = connectionId,
                Tables = GetTables(connection, connectionId, c.ToString())
            }).ToList();

        return new ConnectionSchemaDto
        {
            Id = connectionId,
            Catalogs = catalogs
        };
    }

    public static List<ConnectionTableDto> GetTables(this NpgsqlConnection connection, string connectionId)
    {
        return GetTables(connection, connectionId, connection.Database);
    }

    public static List<ConnectionTableDto> GetTables(this NpgsqlConnection connection, string connectionId, string catalog)
    {
        var schemaDataTypes = connection.GetSchema("DataTypes");

        Dictionary<string?, Type> dataTypes = schemaDataTypes.AsEnumerable()
            .Where(r => r.Field<string?>("TypeName") != null && r.Field<string?>("DataType") != null)
            .ToDictionary(r => r.Field<string>("TypeName"), r => Type.GetType(r.Field<string?>("DataType")));
        Dictionary<string, ConnectionTableDto> tables = new Dictionary<string, ConnectionTableDto>();
        try
        {
            connection.Open();
        }
        catch { }
        if (catalog != connection.Database)
            connection.ChangeDatabase(catalog);
        return connection.Query<ConnectionTableDto, ConnectionColumnDto, ConnectionTableDto>(GetTablesQuery, map: (table, column) =>
                {
                    if (!tables.TryGetValue(table.Id, out ConnectionTableDto tableEntry))
                    {
                        tableEntry = table;
                        tableEntry.CatalogId = $"{connectionId}.{table.Catalog}";
                        tableEntry.Columns = tableEntry.Columns ?? new List<ConnectionColumnDto>();
                        tables.Add(table.Id, tableEntry);
                    }
                    column.DataType = dataTypes.Keys.Contains(column.NativeType) ? dataTypes[column.NativeType] : typeof(string);
                    column.TableId = tableEntry.Id;
                    // tableEntry.Id = $"{connection.ConnectionString.ToMD5()}.{table.Catalog}.{tableEntry.Id}";
                    tableEntry.Columns.Add(column);
                    return tableEntry;
                }, splitOn: "ColumnName").Distinct().ToList();
    }

    public static string BuildQueryExpression(this NpgsqlConnection connection, QueryExpression qe)
    {
        var visitor = new NpgsqlQueryExpressionVisitor();
        qe.Accept(visitor);
        return visitor.GetSql();
    }

}