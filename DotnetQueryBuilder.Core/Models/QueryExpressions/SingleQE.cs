
namespace DotnetQueryBuilder.Core;

public class SingleQE : SelectQE, IColumnExpression, IScalarExpression
{
    public SingleQE(IColumnExpression column) : base(new[] { column })
    {
    }

    public override SingleQE Where(IPredicateExpression where)
    {
        return (SingleQE)base.Where(where);
    }

    public override SingleQE From(ITableExpression from)
    {
        return (SingleQE)base.From(from);
    }

    public override SingleQE Join(params IJoinExpression[] join)
    {
        return (SingleQE)base.Join(join);
    }

    public override SingleQE OrderBy(params OrderByQE[] orderBy)
    {
        return (SingleQE)base.OrderBy(orderBy);
    }

    public IColumnExpression As(string alias)
    {
        return (SingleQE)base.As(alias);
    }

    // public override SingleQE As(string alias)
    // {
    //     return (SingleQE)base.As(alias);
    // }

    public override long? Limit { get => 1; set => base.Limit = 1; }
}