
namespace DotnetQueryBuilder.Core;

public class CaseConditionQE : QueryExpression
{
    public IPredicateExpression Predicate { get; set; }
    public IColumnExpression Then { get; set; }

    public CaseConditionQE(IPredicateExpression predicate, IColumnExpression then)
    {
        if (typeof(CaseQE).IsAssignableFrom(then.GetType()))
            throw new InvalidOperationException("Error: Cannot nest CASE conditions");
        Predicate = predicate;
        Then = then;
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
        return Predicate.GetReferencedColumns();
    }

}
public class CaseQE : QueryExpression, IColumnExpression, IScalarExpression
{
    public IEnumerable<CaseConditionQE> Conditions { get; set; }
    public IColumnExpression Default { get; set; }
    public string? Alias { get; set; }

    public CaseQE(IColumnExpression defaultExpression, params CaseConditionQE[] conditions)
    {
        Default = defaultExpression;
        Conditions = conditions;
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
        return Conditions.SelectMany(cond => cond.GetReferencedColumns()).ToList();
    }
}
