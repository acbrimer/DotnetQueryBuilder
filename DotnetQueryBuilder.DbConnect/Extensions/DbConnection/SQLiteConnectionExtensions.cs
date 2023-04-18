namespace DotnetQueryBuilder.DbConnect;

using System.Data;
using Dapper;
using System.Data.SQLite;
using DotnetQueryBuilder.Core;

public static class SQLiteConnectionExtensions
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
    public static List<ConnectionTableDto> GetTables(this SQLiteConnection connection)
    {
        // var schemaDataTypes = connection.GetSchema("DataTypes");
        // Dictionary<string?, Type> dataTypes = schemaDataTypes.AsEnumerable()
        //     .Where(r => r.Field<string?>("TypeName") != null && r.Field<string?>("DataType") != null)
        //     .ToDictionary(r => r.Field<string>("TypeName"), r => Type.GetType(r.Field<string?>("DataType")));

        var tables = connection.Query<(string TableName, string TableType)>(@"
            SELECT
                name as TableName,
                type as TableType
            FROM sqlite_master
            WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%';");
        return tables.Select(table =>
        {
            var columns = connection.Query<
                (int cid,
                string name,
                string type,
                bool notnull,
                string dflt_value,
                bool pk,
                int rowid,
                bool autoinc,
                bool hidden)>("select * from pragma_table_info(@TableName)", new { TableName = table.TableName });

            var fks = connection.Query<(
                int id,
                int seq,
                string table,
                string from,
                string to,
                string on_update,
                string on_delete,
                string match
            )>($"pragma foreign_key_list({table.TableName});");

            var dbSchemaColumns = columns.Select(col =>
            {
                var dbSchemaCol = new ConnectionColumnDto
                {
                    Table = table.TableName,
                    Catalog = "main",
                    Column = col.name,
                    NativeType = col.type,
                    DataType = col.type == "INTEGER" ? typeof(Int32) : col.type.StartsWith("NUMERIC") ? typeof(Decimal) : typeof(String),
                    OrdinalPosition = col.cid,
                    HasDefault = !string.IsNullOrEmpty(col.dflt_value),
                    ColumnDefault = !string.IsNullOrEmpty(col.dflt_value) ? col.dflt_value : null,
                    IsPrimaryKey = col.pk,
                    IsNullable = !col.notnull,
                    IsAutoIncrementable = col.autoinc
                };
                if (fks.Select(fk => fk.from).Contains(col.name))
                {
                    var fkInfo = fks.Where(fk => fk.from == col.name).FirstOrDefault();
                    dbSchemaCol.IsForeignKey = true;
                    dbSchemaCol.ForeignKeyName = $"FK_{table.TableName}_{fkInfo.id}";
                    dbSchemaCol.ForeignKeySequence = (short)fkInfo.seq;
                    dbSchemaCol.ForeignKeyReferenceTable = fkInfo.table;
                    dbSchemaCol.ForeignKeyReferenceColumn = fkInfo.to;
                }
                return dbSchemaCol;
            });
            return new ConnectionTableDto()
            {
                Id = table.TableName,
                Table = table.TableName,
                Catalog = "main",
                Columns = dbSchemaColumns.ToList()
            };
        }).ToList();
    }
}