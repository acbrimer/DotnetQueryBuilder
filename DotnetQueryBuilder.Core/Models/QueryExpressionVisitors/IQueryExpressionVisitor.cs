namespace DotnetQueryBuilder.Core;
public interface IQueryExpressionVisitor
{
    void OpenScope(QueryExpression current);
    void CloseScope(QueryExpression current);
    List<Type> GetPath();
    string GetPathString();
    void Visit(TableQE table);
    void Visit(SelectQE select);
    void Visit(ColumnQE column);
    void Visit(BinaryQE binary);
    void Visit(ConstantQE constant);
    void Visit(JoinQE join);
    void Visit(PredicateQE predicate);
    void Visit(AndQE and);
    void Visit(OrQE or);
    void Visit(CastQE cast);
    void Visit(ConcatQE concat);
    void Visit(TernaryQE ternaryQE);
    void Visit(CaseConditionQE caseConditionQE);
    void Visit(CaseQE caseQE);
    void Visit(GroupByQE groupByQE);
    void Visit(AggregateQE aggregateQE);
    void Visit(OrderByQE orderByQE);
    void Visit(ITableExpression tableExpression);
}