namespace DotnetQueryBuilder.Core;
public class ColumnQE : QueryExpression, IColumnExpression, IScalarExpression
{
    public string Name { get; set; }
    public string Table { get; set; }
    public string? Alias { get; set; }

    public ColumnQE(string table, string name)
    {
        Table = table;
        Name = name;
    }
    public IColumnExpression As(string alias)
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
    public override List<ColumnQE> GetReferencedColumns()
    {
        return new List<ColumnQE>() { this };
    }
}
