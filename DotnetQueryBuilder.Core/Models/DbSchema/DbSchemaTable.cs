
namespace DotnetQueryBuilder.Core;

public class DbSchemaTable
{
    public string Id { get; set; }
    public string TableSchema { get; set; }
    public string? TableCatalog { get; set; }
    public string TableName { get; set; }
    public string TableType { get; set; }
    public List<DbSchemaColumn> Columns { get; set; }

    public void PrintTable()
    {
        Console.WriteLine($"{TableSchema}.{TableName}");
        foreach (var col in Columns)
        {
            Console.Write($"    {col.ColumnName} {col.NativeType} {col.DataType} ");
            if (col.IsNullable == false)
                Console.Write("[NOT NULL] ");
            if (col.IsPrimaryKey == true)
                Console.Write("[PK] ");
            if (col.IsForeignKey == true)
                Console.Write($"[FK({col.ForeignKeyReferenceColumn})]");
            if (col.IsUnique == true)
                Console.Write("[UNIQUE] ");
            Console.Write("\n");
        }
    }
}
