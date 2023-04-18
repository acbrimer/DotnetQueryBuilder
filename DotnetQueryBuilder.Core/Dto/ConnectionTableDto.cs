
namespace DotnetQueryBuilder.Core;

public class ConnectionTableDto
{
    public string Id { get; set; }
    public string? CatalogId { get; set; }
    public string? Schema { get; set; }
    public string? Catalog { get; set; }
    public string Table { get; set; }
    public string? TableType { get; set; }
    public virtual List<ConnectionColumnDto> Columns { get; set; } = new List<ConnectionColumnDto>();

    public void PrintTable()
    {
        Console.WriteLine($"{Schema}.{Table}");
        foreach (var col in Columns)
        {
            Console.Write($"    {col.Column} {col.NativeType} {col.DataType} ");
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
