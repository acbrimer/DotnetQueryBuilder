namespace DotnetQueryBuilder.Core;

public interface IQueryExpression
{
    void Accept(IQueryExpressionVisitor visitor);

    List<ColumnQE> GetReferencedColumns();
}
