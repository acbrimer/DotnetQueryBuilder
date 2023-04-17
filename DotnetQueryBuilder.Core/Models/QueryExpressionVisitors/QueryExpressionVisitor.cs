using System.Text;
using BasicSQLFormatter;

namespace DotnetQueryBuilder.Core;
public class QueryExpressionVisitor : IQueryExpressionVisitor
{
    public readonly List<QueryExpression> _scope = new List<QueryExpression>();
    public readonly StringBuilder _sqlBuilder = new StringBuilder();
    public readonly List<(string target, string? message)> _errors = new List<(string target, string? message)>();
    public readonly List<string> _tableExpressionAliases = new List<string>();
    public virtual string _sqlIdentifiers { get => "[]"; }
    private readonly List<dynamic> _constants = new List<dynamic>();
    public void Reset()
    {
        _sqlBuilder.Clear();
    }
    public string GetSql()
    {
        return new SQLFormatter(_sqlBuilder.ToString()).Format();
    }
    public void OpenScope(QueryExpression current)
    {
        _scope.Add(current);
    }
    public void CloseScope(QueryExpression current)
    {
        _scope.RemoveAt(_scope.LastIndexOf(current));
    }
    public List<Type> GetPath() => _scope.Select(i => i.GetType()).ToList();
    public List<Type> _path { get => GetPath(); }
    public string GetPathString() => string.Join(',', _scope.Select(i => i.GetType().Name));
    private void AddColumnAlias(IColumnExpression columnExpression)
    {
        if (_path.Count < 2 || _path[_path.Count - 2] == typeof(SelectQE))
        {
            var alias = GetColumnAlias(columnExpression);
            if (!string.IsNullOrEmpty(alias))
                _sqlBuilder.Append($" AS {_sqlIdentifiers[0]}{alias}{_sqlIdentifiers[1]}");
        }
    }
    private string? GetColumnAlias(IColumnExpression columnExpression)
    {
        if (!string.IsNullOrEmpty(columnExpression.Alias))
            return columnExpression.Alias;
        else if (columnExpression.GetType() == typeof(ColumnQE))
            return ((ColumnQE)(columnExpression)).Name;
        return null;
    }
    public virtual void Visit(TableQE table)
    {
        if (!string.IsNullOrEmpty(table.Catalog))
            _sqlBuilder.Append($"{_sqlIdentifiers[0]}{table.Catalog}{_sqlIdentifiers[1]}.");
        if (!string.IsNullOrEmpty(table.Schema))
            _sqlBuilder.Append($"{_sqlIdentifiers[0]}{table.Schema}{_sqlIdentifiers[1]}.");
        _sqlBuilder.Append($"{_sqlIdentifiers[0]}{table.Table}{_sqlIdentifiers[1]}");
        var alias = string.IsNullOrEmpty(table.Alias) ? $"t{_tableExpressionAliases.Count}" : table.Alias;
        _sqlBuilder.Append($" AS {_sqlIdentifiers[0]}{alias}{_sqlIdentifiers[1]}");
    }
    public virtual void Visit(ITableExpression tableExpression)
    {
        Console.WriteLine("Visit ITableExpression");
    }
    public virtual void Visit(SelectQE select)
    {
        /// Add open paren for nested select
        if (_scope.Count > 1)
            _sqlBuilder.Append("(");
        _sqlBuilder.Append("SELECT ");

        /// Add columns
        for (int i = 0; i < select.Columns.Count(); i++)
        {
            select.Columns.ToArray()[i].Accept(this);

            if (i < select.Columns.Count() - 1)
                _sqlBuilder.Append(", ");
        }

        _sqlBuilder.Append(" FROM ");
        if (select.FromClause != null)
            select.FromClause.Accept(this);

        /// Add optional "JOIN" clause(s)
        if (select.JoinClause != null && select.JoinClause.Count() > 0)
        {
            foreach (var joinQE in select.JoinClause)
            {
                if (joinQE.GetType() == typeof(JoinQE))
                    joinQE.Accept(this);
                else
                    _errors.Add((select.ExpressionType, $"Query Expression {joinQE.GetType().Name} is not valid for `SelectQE.Join`"));
            }
        }

        /// Add optional "WHERE" clause
        if (select.WhereClause != null)
        {
            _sqlBuilder.Append(" WHERE ");
            select.WhereClause.Accept(this);
        }

        /// Add optional "GROUB BY" clause
        if (select.GroupByClause != null)
            select.GroupByClause.Accept(this);

        /// Add optional "ORDER BY" clause(s)
        if (select.OrderByClause != null && select.OrderByClause.Count() > 0)
        {
            _sqlBuilder.Append(" ORDER BY ");
            for (int i = 0; i < select.OrderByClause.Count(); i++)
            {
                select.OrderByClause.ToArray()[i].Accept(this);

                if (i < select.OrderByClause.Count() - 1)
                    _sqlBuilder.Append(", ");
            }
        }

        /// Add close paren and optional alias for nested select
        if (_scope.Count > 1)
        {
            _sqlBuilder.Append(")");
            if (!string.IsNullOrEmpty(select.Alias))
                _sqlBuilder.Append($" AS {_sqlIdentifiers[0]}{select.Alias}{_sqlIdentifiers[1]}");
        }


    }
    public virtual void Visit(ColumnQE column)
    {
        if (!string.IsNullOrEmpty(column.Table))
            _sqlBuilder.Append($"{_sqlIdentifiers[0]}{column.Table}{_sqlIdentifiers[1]}.");
        _sqlBuilder.Append($"{_sqlIdentifiers[0]}{column.Name}{_sqlIdentifiers[1]}");
        AddColumnAlias(column);
    }
    public virtual void Visit(OrderByQE orderBy)
    {
        orderBy.Column.Accept(this);
        _sqlBuilder.Append($" {orderBy.Direction}");
    }
    public virtual void Visit(AggregateQE aggregate)
    {
        _sqlBuilder.Append($"{aggregate.Function.ToString()}(");
        aggregate.Expression.Accept(this);
        _sqlBuilder.Append(")");
        AddColumnAlias(aggregate);
    }
    public virtual void Visit(BinaryQE binary)
    {
        _sqlBuilder.Append("(");
        binary.Left.Accept(this);
        _sqlBuilder.Append($" {GetBinaryOperatorSymbol(binary.Operator)} ");
        binary.Right.Accept(this);
        _sqlBuilder.Append(")");
        AddColumnAlias(binary);
    }
    public virtual void Visit(ConstantQE constant)
    {
        // _constants.Add(constant.Value);
        // _sqlBuilder.Append($"@Const{(_constants.Count() - 1)}");
        if (constant.Value is int || constant.Value is short || constant.Value is long || constant.Value is decimal || constant.Value is float)
            _sqlBuilder.Append(constant.Value.ToString());
        else
            _sqlBuilder.Append($"'{constant.Value.ToString()}'");

        AddColumnAlias(constant);
    }
    public virtual void Visit(JoinQE join)
    {
        _sqlBuilder.Append($" {GetJoinTypeSymbol(join.JoinType)} ");
        join.Target.Accept(this);
        _sqlBuilder.Append(" ON ");
        join.Condition.Accept(this);
    }
    public virtual void Visit(GroupByQE groupBy)
    {
        if (groupBy.Columns.Count() > 0)
        {
            _sqlBuilder.Append(" GROUP BY ");
            for (int i = 0; i < groupBy.Columns.Count(); i++)
            {
                groupBy.Columns.ToArray()[i].Accept(this);
                if (i < groupBy.Columns.Count() - 1)
                    _sqlBuilder.Append(", ");
            }
        }
    }
    public virtual void Visit(PredicateQE predicate)
    {
        predicate.Left.Accept(this);
        _sqlBuilder.Append($" {GetPredicateOperatorSymbol(predicate.Operator)} ");
        predicate.Right.Accept(this);
    }
    public virtual void Visit(AndQE and)
    {
        _sqlBuilder.Append("(");
        for (int i = 0; i < and.Expressions.Count(); i++)
        {
            and.Expressions.ToArray()[i].Accept(this);
            if (i < and.Expressions.Count() - 1)
            {
                _sqlBuilder.Append(" AND ");
            }
        }
        _sqlBuilder.Append(")");
    }
    public virtual void Visit(OrQE or)
    {
        _sqlBuilder.Append("(");
        for (int i = 0; i < or.Expressions.Count(); i++)
        {
            or.Expressions.ToArray()[i].Accept(this);
            if (i < or.Expressions.Count() - 1)
            {
                _sqlBuilder.Append(" OR ");
            }
        }
        _sqlBuilder.Append(")");
    }
    public virtual void Visit(CastQE cast)
    {
        _sqlBuilder.Append("CAST(");
        cast.Operand.Accept(this);
        _sqlBuilder.Append($" AS {cast.TargetType}");
        AddColumnAlias(cast);
    }
    public virtual void Visit(ConcatQE concat)
    {
        _sqlBuilder.Append("CONCAT(");
        for (int i = 0; i < concat.Arguments.Count(); i++)
        {
            concat.Arguments.ToArray()[i].Accept(this);
            if (i < concat.Arguments.Count() - 1)
                _sqlBuilder.Append(", ");
        }
        _sqlBuilder.Append(")");
        AddColumnAlias(concat);
    }
    public virtual void Visit(TernaryQE ternary)
    {
        _sqlBuilder.Append("CASE WHEN ");
        ternary.Predicate.Accept(this);
        _sqlBuilder.Append(" THEN ");
        ternary.TrueExpression.Accept(this);
        _sqlBuilder.Append(" ELSE ");
        ternary.FalseExpression.Accept(this);
        _sqlBuilder.Append(" END");
        AddColumnAlias(ternary);
    }
    public virtual void Visit(CaseConditionQE caseCondition)
    {
        _sqlBuilder.Append("WHEN ");
        caseCondition.Predicate.Accept(this);
        _sqlBuilder.Append(" THEN ");
        caseCondition.Then.Accept(this);
    }
    public virtual void Visit(CaseQE caseQE)
    {
        _sqlBuilder.Append("CASE ");
        foreach (var caseCondition in caseQE.Conditions)
            caseCondition.Accept(this);
        _sqlBuilder.Append(" ELSE ");
        caseQE.Default.Accept(this);
        _sqlBuilder.Append(" END");
        AddColumnAlias(caseQE);
    }

    public static readonly Dictionary<BinaryQEOperator, string> BinaryOperatorSymbols =
        new Dictionary<BinaryQEOperator, string>() {
            {BinaryQEOperator.Add, "+"},
            {BinaryQEOperator.Subtract, "-"},
            {BinaryQEOperator.Muliply, "*"},
            {BinaryQEOperator.Divide, "/"}
        };
    public static readonly Dictionary<PredicateQEOperator, string> PredicateOperatorSymbols =
        new Dictionary<PredicateQEOperator, string>() {
            {PredicateQEOperator.Equals, "="},
            {PredicateQEOperator.GreaterThan, ">"},
            {PredicateQEOperator.GreaterThanOrEqualTo, ">="},
            {PredicateQEOperator.LessThan, "<"},
            {PredicateQEOperator.LessThanOrEqualTo, "<="},
            {PredicateQEOperator.Like, "LIKE"},
            {PredicateQEOperator.In, "IN"},
        };

    public static readonly Dictionary<JoinQEType, string> JoinTypeSymbols = new Dictionary<JoinQEType, string>() {
        {JoinQEType.INNER, "INNER JOIN"},
        {JoinQEType.LEFT, "LEFT JOIN"}
    };

    private static string GetPredicateOperatorSymbol(PredicateQEOperator op)
    {
        return PredicateOperatorSymbols[op];
    }

    private static string GetBinaryOperatorSymbol(BinaryQEOperator op)
    {
        return BinaryOperatorSymbols[op];
    }

    public static string GetJoinTypeSymbol(JoinQEType op)
    {
        return JoinTypeSymbols[op];
    }



}