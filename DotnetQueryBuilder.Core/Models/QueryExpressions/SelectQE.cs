
namespace DotnetQueryBuilder.Core;


public class SelectQE : QueryExpression, ITableExpression, ISelectExpression
{
    public IEnumerable<IColumnExpression> Columns { get; set; }
    public ITableExpression? FromClause { get; set; }
    public IEnumerable<IJoinExpression>? JoinClause { get; set; }
    public IPredicateExpression? WhereClause { get; set; }
    public QueryExpression? GroupByClause { get; set; }
    public IEnumerable<OrderByQE>? OrderByClause { get; set; }
    public virtual Int64? Limit { get; set; }
    public virtual Int64? Offset { get; set; }
    public string? Alias { get; set; }
    public SelectQE(params IColumnExpression[] columns)
    {
        Columns = columns;
    }

    public virtual Dictionary<string, string> GetOutputColumns()
    {
        return new Dictionary<string, string>();
    }

    public virtual SelectQE Where(IPredicateExpression where)
    {
        WhereClause = where;
        return this;
    }

    public virtual SelectQE From(ITableExpression from)
    {
        FromClause = from;
        return this;
    }

    public virtual SelectQE Join(params IJoinExpression[] join)
    {
        JoinClause = join;
        return this;
    }

    public virtual SelectQE GroupBy(params IScalarExpression[] columns)
    {
        GroupByClause = new GroupByQE(columns);
        return this;
    }

    public virtual SelectQE OrderBy(params OrderByQE[] orderBy)
    {
        OrderByClause = orderBy;
        return this;
    }

    public virtual SelectQE As(string alias)
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
        var columnsCols = Columns.SelectMany(c => c.GetReferencedColumns());

        var joinCols = JoinClause != null ? JoinClause.SelectMany(j => j.GetReferencedColumns()) : new List<ColumnQE>();
        var whereCols = WhereClause != null ? WhereClause.GetReferencedColumns() : new List<ColumnQE>();
        var orderByCols = OrderByClause != null ? OrderByClause.SelectMany(o => o.GetReferencedColumns()) : new List<ColumnQE>();
        return columnsCols.Concat(joinCols).Concat(whereCols).Concat(orderByCols).ToList();
    }


}

/**
#region Constructors
    public SelectQE() { }
    public SelectQE(TableQE from, PredicateQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    public SelectQE(JoinQE from, PredicateQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    public SelectQE(SubqueryQE from, PredicateQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    public SelectQE(TableQE from, AndQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    public SelectQE(JoinQE from, AndQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    public SelectQE(SubqueryQE from, AndQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    public SelectQE(TableQE from, OrQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    public SelectQE(JoinQE from, OrQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    public SelectQE(SubqueryQE from, OrQE where, params FieldQE[] fields)
    {
        Fields = fields;
        From = from;
        Where = where;
    }
    #endregion
    **/
