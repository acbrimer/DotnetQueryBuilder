namespace DotnetQueryBuilder.Core;

public class QueryDefinition
{
    public SelectQE BaseExpression { get; set; }
    private QueryExpressionVisitor visitor = new QueryExpressionVisitor();
    public QueryDefinition(SelectQE select)
    {
        BaseExpression = select;
    }

}

public class QueryDefinition<T> : QueryDefinition
{
    public QueryDefinition(SelectQE select) : base(select)
    {
    }
}
