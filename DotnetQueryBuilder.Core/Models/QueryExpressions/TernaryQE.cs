namespace DotnetQueryBuilder.Core;

public class TernaryQE : QueryExpression, IColumnExpression
{
    public IPredicateExpression Predicate { get; set; }
    public IColumnExpression TrueExpression { get; set; }
    public IColumnExpression FalseExpression { get; set; }
    public string? Alias { get; set; }

    public TernaryQE(IPredicateExpression predicate, IColumnExpression trueExpression, IColumnExpression falseExpression)
    {
        Predicate = predicate;
        TrueExpression = trueExpression;
        FalseExpression = falseExpression;
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
        return Predicate.GetReferencedColumns()
            .Concat(TrueExpression.GetReferencedColumns())
            .Concat(FalseExpression.GetReferencedColumns()).ToList();
    }
}
