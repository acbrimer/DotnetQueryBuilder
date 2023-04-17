namespace DotnetQueryBuilder.Core;

public class NpgsqlQueryExpressionVisitor : QueryExpressionVisitor
{
    public override string _sqlIdentifiers { get => "\"\""; }
    public override void Visit(ConcatQE concat)
    {
        for (int i = 0; i < concat.Arguments.Count(); i++)
        {
            concat.Arguments.ToArray()[i].Accept(this);
            if (i < concat.Arguments.Count() - 1)
                _sqlBuilder.Append(" || ");
        }
    }
    public override void Visit(PredicateQE predicate)
    {
        predicate.Left.Accept(this);
        _sqlBuilder.Append($" {GetPredicateOperatorSymbol(predicate.Operator)} ");
        predicate.Right.Accept(this);
    }
    private static string GetPredicateOperatorSymbol(PredicateQEOperator op)
    {
        if (op == PredicateQEOperator.Like)
            return "ILIKE";
        return PredicateOperatorSymbols[op];
    }

}