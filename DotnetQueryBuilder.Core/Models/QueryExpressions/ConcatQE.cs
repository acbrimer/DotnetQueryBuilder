
namespace DotnetQueryBuilder.Core;

public class ConcatCE : QueryExpression, IColumnExpression, IScalarExpression
{
    public IEnumerable<IColumnExpression> Arguments { get; set; }
    public string? Alias { get; set; }
    public ConcatCE(params IColumnExpression[] arguments)
    {
        Arguments = arguments;
    }
    public IColumnExpression As(string alias)
    {
        Alias = alias;
        return this;
    }
    public override void Accept(IQueryExpressionVisitor visitor)
    {
        visitor.Visit(this);
    }

    public override List<ColumnQE> GetReferencedColumns()
    {
        return Arguments.SelectMany(arg => arg.GetReferencedColumns()).ToList();
    }
}
