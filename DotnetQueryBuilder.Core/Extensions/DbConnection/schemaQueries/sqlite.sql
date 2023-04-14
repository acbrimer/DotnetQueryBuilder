WITH tables_cte AS (
    SELECT
        name as Id,
        null as TableCatalog,
        null as TableSchema,
        name as TableName,
        type as TableType
    FROM
        sqlite_master
    WHERE
        type IN ('table', 'view')
        AND name NOT LIKE 'sqlite_%'
),
columns_cte AS (
    SELECT
        c.column_name AS ColumnName,
        c.data_type AS NativeType,
        c.table_name as TableName,
        c.null as TableSchema,
        c.column_default AS ColumnDefault,
        CASE
            WHEN c.is_nullable = 'NO' THEN 0
            ELSE 1
        END AS IsNullable,
        c.character_maximum_length AS CharacterMaximumLength,
        c.numeric_precision AS NumericPrecision,
        c.numeric_scale AS NumericScale,
        c.datetime_precision AS DateTimePrecision,
        c.ordinal_position AS OrdinalPosition,
        CASE
            WHEN c.column_default IS NOT NULL THEN 1
            ELSE 0
        END AS HasDefault,
        CASE
            WHEN pk.column_name IS NOT NULL THEN 1
            ELSE 0
        END AS IsPrimaryKey,
        CASE
            WHEN fk.column_name IS NOT NULL THEN 1
            ELSE 0
        END AS IsForeignKey,
        fk.constraint_name AS ForeignKeyName,
        fk.ordinal_position AS ForeignKeySequence,
        fk.referenced_null AS ForeignKeyReferenceSchema,
        fk.referenced_table_name AS ForeignKeyReferenceTable,
        fk.referenced_column_name AS ForeignKeyReferenceColumn
    FROM
        pragma_table_info(
            (
                SELECT
                    name
                FROM
                    sqlite_master
                WHERE
                    type = 'table'
                    AND name NOT LIKE 'sqlite_%'
            )
        ) AS c
        LEFT JOIN (
            SELECT
                column_name
            FROM
                pragma_table_info(
                    (
                        SELECT
                            name
                        FROM
                            sqlite_master
                        WHERE
                            type = 'table'
                            AND name NOT LIKE 'sqlite_%'
                    )
                )
            WHERE
                pk = 1
        ) pk ON c.column_name = pk.column_name
        LEFT JOIN (
            SELECT
                *
            FROM
                pragma_foreign_key_list(
                    (
                        SELECT
                            name
                        FROM
                            sqlite_master
                        WHERE
                            type = 'table'
                            AND name NOT LIKE 'sqlite_%'
                    )
                )
        ) fk ON c.column_name = fk.column_name
)
SELECT
    t.*,
    c.*
FROM
    tables_cte AS t
    INNER JOIN columns_cte AS c ON t.TableSchema = c.TableSchema
    AND t.TableName = c.TableName;