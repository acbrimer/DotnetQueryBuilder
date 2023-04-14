
namespace DotnetQueryBuilder.Core;

public class CastQE : QueryExpression, IColumnExpression, IScalarExpression
{
    public IColumnExpression Operand { get; set; }
    public string TargetType { get; set; }
    public string? Alias { get; set; }

    public CastQE(IColumnExpression operand, string targetType)
    {
        Operand = operand;
        TargetType = targetType;
    }

    public IColumnExpression As(string alias)
    {
        Alias = alias;
        return this;
    }

    public override void Accept(IQueryExpressionVisitor visitor)
    {
        visitor.OpenScope(this);
        visitor.Visit(this);
        visitor.CloseScope(this);
    }
    public override List<ColumnQE> GetReferencedColumns()
    {
        return Operand.GetReferencedColumns();
    }
}
