import IQueryExpressionVisitor from "./Visitors/IQueryExpressionVisitor";
import QueryExpressionVisitor from "./Visitors/QueryExpressionVisitor";

class QueryExpression implements IQueryExpression {
  _type!:
    | "aggregate"
    | "and"
    | "binary"
    | "casecondition"
    | "case"
    | "cast"
    | "column"
    | "constant"
    | "groupby"
    | "join"
    | "orderby"
    | "or"
    | "predicate"
    | "select"
    | "single"
    | "table"
    | "ternary"
    | "concat";

  [prop: string]: any;

  constructor(obj: { [key: string]: any }) {
    // Spread matching keys to class properties
    for (const key of Object.keys(obj)) {
      if (this.hasOwnProperty(key)) {
        this[key] = obj[key];
      }
    }

    // Add additional properties not defined in the class
    for (const key of Object.keys(obj)) {
      if (!this.hasOwnProperty(key)) {
        this[key] = obj[key];
      }
    }
  }

  _builder: QueryExpressionVisitor = new QueryExpressionVisitor();

  Accept(visitor: IQueryExpressionVisitor) {
    visitor.Visit(this);
  }

  ToSql() {
    this._builder.Reset();
    this.Accept(this._builder);
    return this._builder.GetSql();
  }
}

export default QueryExpression;
