using DotnetQueryBuilder.DbConnect;

using System.Data;
using Npgsql;
using Dapper;
using System.Data.SQLite;
using System.Data.SqlClient;
using DotnetQueryBuilder.Core;

public static class SqlConnectionExtensions
{
    public static readonly string GetTablesQuery = @"
        WITH tables_cte AS (
SELECT
CONCAT(table_catalog, '.', table_schema, '.', table_name) as Id,
table_catalog as TableCatalog,
table_schema as TableSchema,
table_name as TableName,
table_type as TableType
FROM information_schema.tables
WHERE table_schema NOT IN ('information_schema', 'sys')
AND table_type IN ('BASE TABLE', 'VIEW')
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
CASE WHEN pk.is_primary_key = 1 THEN 1 ELSE 0 END AS IsPrimaryKey,
CASE WHEN fk.is_foreign_key = 1 THEN 1 ELSE 0 END AS IsForeignKey,
fk.constraint_name AS ForeignKeyName,
fk.constraint_schema AS ForeignKeyReferenceSchema,
fk.referenced_table_name AS ForeignKeyReferenceTable,
fk.referenced_column_name AS ForeignKeyReferenceColumn
FROM
information_schema.columns c
LEFT JOIN (
SELECT
kcu.table_schema,
kcu.table_name,
kcu.column_name,
1 AS is_primary_key
FROM
information_schema.key_column_usage kcu
JOIN information_schema.table_constraints tc ON
kcu.constraint_schema = tc.constraint_schema AND
kcu.constraint_name = tc.constraint_name AND
tc.constraint_type = 'PRIMARY KEY'
) pk ON
c.table_schema = pk.table_schema AND
c.table_name = pk.table_name AND
c.column_name = pk.column_name
LEFT JOIN (
SELECT
kcu.table_schema,
kcu.table_name,
kcu.column_name,
rc.constraint_name,
rc.constraint_schema,
rc.referenced_table_name,
rc.referenced_column_name,
1 AS is_foreign_key
FROM
information_schema.key_column_usage kcu
JOIN information_schema.table_constraints tc ON
kcu.constraint_schema = tc.constraint_schema AND
kcu.constraint_name = tc.constraint_name AND
tc.constraint_type = 'FOREIGN KEY'
JOIN information_schema.referential_constraints rc ON
kcu.constraint_schema = rc.constraint_schema AND
kcu.constraint_name = rc.constraint_name
) fk ON
c.table_schema = fk.table_schema AND
c.table_name = fk.table_name AND
c.column_name = fk.column_name
)
SELECT
t.,
c.
FROM
tables_cte AS t
INNER JOIN columns_cte AS c ON t.TableSchema = c.TableSchema AND t.TableName = c.TableName;";
    public static List<DbSchemaTable> GetTables(this SqlConnection connection)
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