
namespace DotnetQueryBuilder.Core;

public class TableQE : QueryExpression, ITableExpression
{
    public string? Catalog { get; set; }
    public string? Schema { get; set; }
    public string Table { get; set; }
    public string? Alias { get; set; }

    public TableQE(string catalog, string schema, string table)
    {
        Catalog = catalog;
        Schema = schema;
        Table = table;
        Alias = table;
    }
    public TableQE(string schema, string table)
    {
        Schema = schema;
        Table = table;
        Alias = table;
    }
    public TableQE(string table)
    {
        Table = table;
        Alias = table;
    }

    public TableQE As(string alias)
    {
        Alias = alias;
        return this;
    }
    public override void Accept(IQueryExpressionVisitor visitor)
    {
        visitor.OpenScope(this);
        ExpressionPath = visitor.GetPath();
        visitor.Visit(this);
        visitor.CloseScope(this);
    }

    public Dictionary<string, string> GetOutputColumns()
    {
        throw new NotImplementedException();
    }
}
