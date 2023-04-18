
namespace DotnetQueryBuilder.Core;

public class ConnectionColumnDto
{
    public string Id { get; set; }
    public string? Schema { get; set; }
    public string? Catalog { get; set; }
    public string TableId { get; set; }
    public string Table { get; set; }
    public string? TableAlias { get; set; }
    public string Column { get; set; }
    public string? Alias { get; set; }
    public string? Description { get; set; }
    // The db type for the column
    public string NativeType { get; set; }
    // The correct target .net type for the NativeType
    public Type DataType { get; set; }
    public Int32? OrdinalPosition { get; set; }
    public bool? HasDefault { get; set; }
    public string? ColumnDefault { get; set; }
    public Int32? CharacherMaximumLength { get; set; }
    public Int32? NumericPrecision { get; set; }
    public Int32? NumericScale { get; set; }
    public Int64? DateTimePrecision { get; set; }
    public bool? IsPrimaryKey { get; set; }
    public bool? IsForeignKey { get; set; }
    public string? ForeignKeyName { get; set; }
    public Int16? ForeignKeySequence { get; set; }
    public string? ForeignKeyReferenceCatalog { get; set; }
    public string? ForeignKeyReferenceSchema { get; set; }
    public string? ForeignKeyReferenceTable { get; set; }
    public string? ForeignKeyReferenceColumn { get; set; }
    public bool? IsNullable { get; set; }
    public bool? IsAutoIncrementable { get; set; }
    public bool? IsUnique { get; set; }

}
