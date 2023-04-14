namespace DotnetQueryBuilder.DbConnect;

using System.Data;
using Dapper;
using MySql.Data.MySqlClient;
using DotnetQueryBuilder.Core;

public static class MySqlConnectionExtensions
{
    public static readonly string GetTablesQuery = @"
        WITH tables_cte AS (
            SELECT
            table_catalog || '.' || table_schema || '.' || table_name as Id,
            table_catalog as TableCatalog,
            table_schema as TableSchema,
            table_name as TableName,
            table_type as TableType
            FROM sqlite_master
        WHERE type IN ('table', 'view')
        AND name NOT LIKE 'sqlite_%'
        ),
        columns_cte AS (
            SELECT
            c.column_name AS ColumnName,
            c.data_type AS NativeType,
            c.table_name as TableName,
            c.table_schema as TableSchema,
            c.column_default AS ColumnDefault,
            CASE WHEN c.is_nullable = 'NO' THEN 0 ELSE 1 END AS IsNullable,
            c.character_maximum_length AS CharacterMaximumLength,
            c.numeric_precision AS NumericPrecision,
            c.numeric_scale AS NumericScale,
            c.datetime_precision AS DateTimePrecision,
            c.ordinal_position AS OrdinalPosition,
            CASE WHEN c.column_default IS NOT NULL THEN 1 ELSE 0 END AS HasDefault,
            CASE WHEN pk.column_name IS NOT NULL THEN 1 ELSE 0 END AS IsPrimaryKey,
            CASE WHEN fk.column_name IS NOT NULL THEN 1 ELSE 0 END AS IsForeignKey,
            fk.constraint_name AS ForeignKeyName,
            fk.ordinal_position AS ForeignKeySequence,
            fk.referenced_table_schema AS ForeignKeyReferenceSchema,
            fk.referenced_table_name AS ForeignKeyReferenceTable,
            fk.referenced_column_name AS ForeignKeyReferenceColumn
            FROM
            pragma_table_info((SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'))
            AS c
            LEFT JOIN (SELECT column_name FROM pragma_table_info((SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%')) WHERE pk = 1) pk ON c.column_name = pk.column_name
            LEFT JOIN (SELECT * FROM pragma_foreign_key_list((SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'))) fk ON c.column_name = fk.column_name
            )
            SELECT
            t.*,
            c.*
            FROM
            tables_cte AS t
            INNER JOIN columns_cte AS c ON t.TableSchema = c.TableSchema AND t.TableName = c.TableName;";

    public static List<DbSchemaTable> GetTables(this MySqlConnection connection)
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
}