import QueryExpression from "../QueryExpression";
import IQueryExpressionVisitor from "./IQueryExpressionVisitor";
import { format } from "sql-formatter";

export const DEFAULT_SQL_IDENTIFIERS: string[] = ["[", "]"];

export const DEFAULT_PREDICATE_OPERATORS: any = {
  Equals: "=",
  Like: "LIKE",
  In: "IN",
  GreaterThan: ">",
  GreaterThanOrEqualTo: ">=",
  LessThan: "<",
  LessThanOrEqualTo: "<=",
};

class QueryExpressionVisitor implements IQueryExpressionVisitor {
  _scope: any[] = [];
  _path: Pick<IQueryExpression, "_type">[] = [];

  _sqlBuilder: string[] = [];

  _logVisits: boolean = false;

  Reset = () => (this._sqlBuilder.length = 0);

  GetSql = () => {
    return this._sqlBuilder.join("");
  };

  Quotename = (name: string) => {
    return `${DEFAULT_SQL_IDENTIFIERS[0]}${name}${DEFAULT_SQL_IDENTIFIERS[1]}`;
  };

  Visit = (expression: IQueryExpression) => {
    this._scope.push(expression);
    this._path.push(expression._type as any);

    if (this._logVisits) console.log("Path:", this._path.join(" -> "));

    /// Call the correct `Visit_` function based on `expression._type`
    switch (expression._type) {
      case "table":
        this.Visit_TableQE(expression as ITableQE);
        break;
      case "select":
      case "single":
        this.Visit_SelectQE(expression as ISelectQE);
        break;
      case "column":
        this.Visit_ColumnQE(expression as IColumnQE);
        break;
      case "binary":
        this.Visit_BinaryQE(expression as IBinaryQE);
        break;
      case "constant":
        this.Visit_ConstantQE(expression as IConstantQE);
        break;
      case "join":
        this.Visit_JoinQE(expression as IJoinQE);
        break;
      case "predicate":
        this.Visit_PredicateQE(expression as IPredicateQE);
        break;
      case "and":
        this.Visit_AndQE(expression as IAndQE);
        break;
      case "or":
        this.Visit_OrQE(expression as IOrQE);
        break;
      case "cast":
        this.Visit_CastQE(expression as ICastQE);
        break;
      case "concat":
        this.Visit_ConcatQE(expression as IConcatQE);
        break;
      case "ternary":
        this.Visit_TernaryQE(expression as ITernaryQE);
        break;
      case "casecondition":
        this.Visit_CaseConditionQE(expression as ICaseConditionQE);
        break;
      case "case":
        this.Visit_CaseQE(expression as ICaseQE);
        break;
      case "groupby":
        this.Visit_GroupByQE(expression as IGroupByQE);
        break;
      case "aggregate":
        this.Visit_AggregateQE(expression as IAggregateQE);
        break;
      case "orderby":
        this.Visit_OrderByQE(expression as IOrderByQE);
        break;
      default:
        throw new Error(`Invalid expression type: ${expression._type}`);
    }
    this._scope.pop();
    this._path.pop();
  };

  Visit_TableQE(table: ITableQE) {
    if (this._logVisits) {
      console.log("Visit_TableQE", table);
    }
    if (table.catalog) this._sqlBuilder.push(this.Quotename(table.catalog));
    if (table.schema) this._sqlBuilder.push(this.Quotename(table.schema));
    this._sqlBuilder.push(this.Quotename(table.table));
    if (table.alias !== null)
      this._sqlBuilder.push(` AS ${this.Quotename(table.alias)}`);
  }

  Visit_SelectQE(select: ISelectQE) {
    if (this._logVisits) {
      console.log("Visit_SelectQE", select);
    }
    /// Add open paren for nested select
    if (this._scope.length > 1) this._sqlBuilder.push("(");
    this._sqlBuilder.push("SELECT\n");
    /// Add columns
    for (var i = 0; i < select.columns.length; i++) {
      new QueryExpression(select.columns[i]).Accept(this);

      if (i < select.columns.length - 1) this._sqlBuilder.push(",");
      this._sqlBuilder.push("\n");
    }

    this._sqlBuilder.push("FROM ");
    if (select.fromClause != null)
      new QueryExpression(select.fromClause).Accept(this);

    /// Add optional "JOIN" clause(s)
    if (select.joinClause != null && select.joinClause.length > 0) {
      select.joinClause.forEach((joinQE) => {
        if (joinQE._type === "join") new QueryExpression(joinQE).Accept(this);
      });
    }

    /// Add optional "WHERE" clause
    if (select.whereClause != null) {
      this._sqlBuilder.push(" WHERE ");
      new QueryExpression(select.whereClause).Accept(this);
    }

    /// Add optional "GROUB BY" clause
    if (select.groupByClause != null)
      new QueryExpression(select.groupByClause).Accept(this);

    /// Add optional "ORDER BY" clause(s)
    if (select.orderByClause != null && select.orderByClause.length > 0) {
      this._sqlBuilder.push(" ORDER BY ");
      for (var i = 0; i < select.orderByClause.length; i++) {
        new QueryExpression(select.orderByClause[i]).Accept(this);

        if (i < select.orderByClause.length - 1) this._sqlBuilder.push(", ");
      }
    }

    /// Add close paren and optional alias for nested select
    if (this._scope.length > 1) {
      this._sqlBuilder.push(")");
      if (select.alias)
        this._sqlBuilder.push(` AS ${this.Quotename(select.alias)}`);
    }
  }

  Visit_ColumnQE(column: IColumnQE) {
    if (this._logVisits) {
      console.log("Visit_ColumnQE");
    }
    if (
      this._path.length < 2 ||
      this._path[this._path.length - 2] === ("select" as any)
    )
      this._sqlBuilder.push("\t");
    if (column.table !== null)
      this._sqlBuilder.push(`${this.Quotename(column.table)}.`);
    this._sqlBuilder.push(this.Quotename(column.name));
    this.AddColumnAlias(column);
  }

  Visit_BinaryQE(binary: IBinaryQE) {
    if (this._logVisits) {
      console.log("Visit_BinaryQE");
    }
    if (
      this._path.length < 2 ||
      this._path[this._path.length - 2] === ("select" as any)
    )
      this._sqlBuilder.push("\t");
    this._sqlBuilder.push("(");
    new QueryExpression(binary.left).Accept(this);
    this._sqlBuilder.push(` ${binary.operator} `);
    new QueryExpression(binary.right).Accept(this);
    this._sqlBuilder.push(")");
    this.AddColumnAlias(binary);
  }

  Visit_ConstantQE(constant: IConstantQE) {
    if (this._logVisits) {
      console.log("Visit_ConstantQE");
    }
  }

  Visit_JoinQE(join: IJoinQE) {
    if (this._logVisits) {
      console.log("Visit_JoinQE");
    }
    this._sqlBuilder.push(` ${this.GetJoinTypeSymbol(join.joinType)} `);
    new QueryExpression(join.target).Accept(this);
    this._sqlBuilder.push(" ON ");
    new QueryExpression(join.condition).Accept(this);
  }

  Visit_PredicateQE(predicate: IPredicateQE) {
    if (this._logVisits) {
      console.log("Visit_PredicateQE", predicate);
    }
    new QueryExpression(predicate.left).Accept(this);
    this._sqlBuilder.push(
      ` ${this.GetPredicateOperatorSymbol(predicate.operator)} `
    );
    new QueryExpression(predicate.right).Accept(this);
  }

  Visit_AndQE(and: IAndQE) {
    if (this._logVisits) {
      console.log("Visit_AndQE");
    }
    this._sqlBuilder.push("(");
    for (var i = 0; i < and.expressions.length; i++) {
      new QueryExpression(and.expressions[i]).Accept(this);
      if (i < and.expressions.length - 1) {
        this._sqlBuilder.push(" AND ");
      }
    }
    this._sqlBuilder.push(")");
  }

  Visit_OrQE(or: IOrQE) {
    if (this._logVisits) {
      console.log("Visit_OrQE");
    }
    this._sqlBuilder.push("(");
    for (var i = 0; i < or.expressions.length; i++) {
      new QueryExpression(or.expressions[i]).Accept(this);
      if (i < or.expressions.length - 1) {
        this._sqlBuilder.push(" OR ");
      }
    }
    this._sqlBuilder.push(")");
  }

  Visit_CastQE(cast: ICastQE) {
    if (this._logVisits) {
      console.log("Visit_CastQE");
    }
    this._sqlBuilder.push("CAST(");
    new QueryExpression(cast.operand).Accept(this);
    this._sqlBuilder.push(` AS ${cast.targetType}`);
    this.AddColumnAlias(cast);
  }

  Visit_ConcatQE(concat: IConcatQE) {
    if (this._logVisits) {
      console.log("Visit_ConcatCE");
    }
    this._sqlBuilder.push("CONCAT(");
    for (var i = 0; i < concat.arguments.length; i++) {
      new QueryExpression(concat.arguments[i]).Accept(this);
      if (i < concat.arguments.length - 1) this._sqlBuilder.push(", ");
    }
    this._sqlBuilder.push(")");
    this.AddColumnAlias(concat);
  }

  Visit_TernaryQE(ternary: ITernaryQE) {
    if (this._logVisits) {
      console.log("Visit_TernaryQE");
    }
    this._sqlBuilder.push("CASE WHEN ");
    new QueryExpression(ternary.predicate).Accept(this);
    this._sqlBuilder.push(" THEN ");
    new QueryExpression(ternary.trueExpression).Accept(this);
    this._sqlBuilder.push(" ELSE ");
    new QueryExpression(ternary.falseExpression).Accept(this);
    this._sqlBuilder.push(" END");
    this.AddColumnAlias(ternary);
  }

  Visit_CaseConditionQE(caseCondition: ICaseConditionQE) {
    if (this._logVisits) {
      console.log("Visit_CaseConditionQE");
    }
    this._sqlBuilder.push("WHEN ");
    new QueryExpression(caseCondition.predicate).Accept(this);
    this._sqlBuilder.push(" THEN ");
    new QueryExpression(caseCondition.then).Accept(this);
  }

  Visit_CaseQE(caseQE: ICaseQE) {
    if (this._logVisits) {
      console.log("Visit_CaseConditionQE");
    }
    this._sqlBuilder.push("CASE ");
    caseQE.conditions.forEach((caseCondition: ICaseConditionQE) => {
      new QueryExpression(caseCondition).Accept(this);
    });

    this._sqlBuilder.push(" ELSE ");
    new QueryExpression(caseQE.default).Accept(this);
    this._sqlBuilder.push(" END");
    this.AddColumnAlias(caseQE);
  }

  Visit_GroupByQE(groupByQE: IGroupByQE) {
    if (this._logVisits) {
      console.log("Visit_CaseConditionQE");
    }
  }

  Visit_AggregateQE(aggregate: IAggregateQE) {
    if (this._logVisits) {
      console.log("Visit_CaseConditionQE");
    }
    this._sqlBuilder.push(`${aggregate.function.toString()}(`);
    new QueryExpression(aggregate.expression).Accept(this);
    this._sqlBuilder.push(")");
    this.AddColumnAlias(aggregate);
  }

  Visit_OrderByQE(orderBy: IOrderByQE) {
    if (this._logVisits) {
      console.log("Visit_CaseConditionQE");
    }
    new QueryExpression(orderBy.column).Accept(this);
    this._sqlBuilder.push(` ${orderBy.direction}`);
  }

  AddColumnAlias(columnExpression: IQueryExpression) {
    if (
      this._path.length < 2 ||
      this._path[this._path.length - 2] === ("select" as any)
    ) {
      var alias = this.GetColumnAlias(columnExpression);
      if (alias !== null && alias !== undefined)
        this._sqlBuilder.push(` AS ${this.Quotename(alias)}`);
    }
  }

  GetColumnAlias(columnExpression: any) {
    if (columnExpression.alias !== null) return columnExpression.alias;
    else if (columnExpression._type === "column") return columnExpression.name;
    return null;
  }

  GetJoinTypeSymbol(joinType: string) {
    return joinType.toUpperCase() + " JOIN";
  }

  GetPredicateOperatorSymbol(predicateOperator: string) {
    if (Object.keys(DEFAULT_PREDICATE_OPERATORS).includes(predicateOperator))
      return DEFAULT_PREDICATE_OPERATORS[predicateOperator];
    return "=";
  }
}

export default QueryExpressionVisitor;
