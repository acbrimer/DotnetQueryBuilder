
namespace DotnetQueryBuilder.Core;
using Newtonsoft.Json;

public class GroupByQE : QueryExpression
{
    public IEnumerable<IScalarExpression> Columns { get; set; }
    public override void Accept(IQueryExpressionVisitor visitor)
    {
        visitor.OpenScope(this);
        ExpressionPath = visitor.GetPath();
        visitor.Visit(this);
        visitor.CloseScope(this);
    }
}
