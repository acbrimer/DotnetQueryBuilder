namespace DotnetQueryBuilder.DbConnect;

using System.Data;
using Npgsql;
using Dapper;
using DotnetQueryBuilder.Core;

public static class NpgsqlConnectionExtensions
{
    public static readonly string GetTablesQuery = @"
            WITH tables_cte
            AS (
                SELECT 
                table_catalog || '.' || table_schema || '.' || table_name as Id,
                table_catalog as TableCatalog,
                table_schema as TableSchema,
                table_name as TableName,
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
                ON t.TableSchema = c.TableSchema
                AND t.TableName = c.TableName";
    public static List<DbSchemaTable> GetTables(this NpgsqlConnection connection)
    {
        var schemaDataTypes = connection.GetSchema("DataTypes");
        Dictionary<string?, Type> dataTypes = schemaDataTypes.AsEnumerable()
            .Where(r => r.Field<string?>("TypeName") != null && r.Field<string?>("DataType") != null)
            .ToDictionary(r => r.Field<string>("TypeName"), r => Type.GetType(r.Field<string?>("DataType")));
        Dictionary<string, DbSchemaTable> tables = new Dictionary<string, DbSchemaTable>();

        return connection.Query<DbSchemaTable, DbSchemaColumn, DbSchemaTable>(GetTablesQuery, map: (table, column) =>
                {
                    if (!tables.TryGetValue(table.Id, out DbSchemaTable tableEntry))
                    {
                        tableEntry = table;
                        tableEntry.Columns = tableEntry.Columns ?? new List<DbSchemaColumn>();
                        tables.Add(table.Id, tableEntry);
                    }
                    column.DataType = dataTypes.Keys.Contains(column.NativeType) ? dataTypes[column.NativeType] : typeof(string);
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