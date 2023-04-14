
namespace DotnetQueryBuilder.Core;

public class OrQE : QueryExpression, IPredicateExpression
{
    public IEnumerable<IPredicateExpression> Expressions { get; set; }

    public OrQE(params IPredicateExpression[] expressions)
    {
        Expressions = expressions;
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
        return Expressions.SelectMany(p => p.GetReferencedColumns()).ToList();
    }
}
