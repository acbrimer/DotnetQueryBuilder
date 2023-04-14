
namespace DotnetQueryBuilder.Core;

public class ConstantQE : QueryExpression, IColumnExpression, IScalarExpression
{
    public dynamic Value { get; set; }
    public string? Alias { get; set; }
    public DbCommonType? CommonType { get; set; }
    public string? NativeType { get; set; }
    public Type? DataType { get => Value.GetType(); }


    public ConstantQE(dynamic value)
    {
        Value = value;
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

}
