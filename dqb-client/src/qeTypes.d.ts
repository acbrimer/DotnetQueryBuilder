interface IQueryExpression {
  _type:
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
    | "ternary";
}
type AggregateQEFunction = "COUNT" | "COUNTD" | "MIN" | "MAX" | "SUM" | "AVG";
interface IAggregateQE extends IQueryExpression {
  function: AggregateQEFunction;
  expression:
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE;
  alias: string;
  _type: "aggregate";
}
interface IAndQE extends IQueryExpression {
  expressions: (IAndQE | IOrQE | IPredicateQE)[];
  _type: "and";
}
type BinaryQEOperator = "Add" | "Subtract" | "Muliply" | "Divide";
interface IBinaryQE extends IQueryExpression {
  operator: BinaryQEOperator;
  left:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  right:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  alias: string;
  _type: "binary";
}
interface ICaseConditionQE extends IQueryExpression {
  predicate: IAndQE | IOrQE | IPredicateQE;
  then:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  _type: "casecondition";
}
interface ICaseQE extends IQueryExpression {
  conditions: ICaseConditionQE[];
  default:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  alias: string;
  _type: "case";
}
interface ICastQE extends IQueryExpression {
  operand:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  targetType: string;
  alias: string;
  _type: "cast";
}
interface IColumnQE extends IQueryExpression {
  name: string;
  table: string;
  alias: string;
  _type: "column";
}
interface IConstantQE extends IQueryExpression {
  value: any;
  alias: string;
  commonType: number | null;
  nativeType: string;
  dataType: any;
  _type: "constant";
}
interface IGroupByQE extends IQueryExpression {
  columns: (
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
  )[];
  _type: "groupby";
}
type JoinQEType = "INNER" | "LEFT";
interface IJoinQE extends IQueryExpression {
  joinType: JoinQEType;
  target: ISelectQE | ISingleQE | ITableQE;
  condition: IAndQE | IOrQE | IPredicateQE;
  _type: "join";
}
type OrderByQEDirection = "ASC" | "DESC";
interface IOrderByQE extends IQueryExpression {
  direction: OrderByQEDirection;
  column:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  alias: string;
  _type: "orderby";
}
interface IOrQE extends IQueryExpression {
  expressions: (IAndQE | IOrQE | IPredicateQE)[];
  _type: "or";
}
type PredicateQEOperator =
  | "Equals"
  | "Like"
  | "In"
  | "GreaterThan"
  | "GreaterThanOrEqualTo"
  | "LessThan"
  | "LessThanOrEqualTo";
interface IPredicateQE extends IQueryExpression {
  operator: PredicateQEOperator;
  left:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  right:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  _type: "predicate";
}
interface ISelectQE extends IQueryExpression {
  columns: (
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE
  )[];
  fromClause: ISelectQE | ISingleQE | ITableQE;
  joinClause: IJoinQE[];
  whereClause: IAndQE | IOrQE | IPredicateQE;
  groupByClause:
    | IAggregateQE
    | IAndQE
    | IBinaryQE
    | ICaseConditionQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | IGroupByQE
    | IJoinQE
    | IOrderByQE
    | IOrQE
    | IPredicateQE
    | ISelectQE
    | ISingleQE
    | ITableQE
    | ITernaryQE;
  orderByClause: IOrderByQE[];
  limit: number | null;
  offset: number | null;
  alias: string;
  _type: "select";
}
interface ISingleQE extends IQueryExpression {
  limit: number | null;
  columns: (
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE
  )[];
  fromClause: ISelectQE | ISingleQE | ITableQE;
  joinClause: IJoinQE[];
  whereClause: IAndQE | IOrQE | IPredicateQE;
  groupByClause:
    | IAggregateQE
    | IAndQE
    | IBinaryQE
    | ICaseConditionQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | IGroupByQE
    | IJoinQE
    | IOrderByQE
    | IOrQE
    | IPredicateQE
    | ISelectQE
    | ISingleQE
    | ITableQE
    | ITernaryQE;
  orderByClause: IOrderByQE[];
  offset: number | null;
  alias: string;
  _type: "single";
}
interface ITableQE extends IQueryExpression {
  catalog: string;
  schema: string;
  table: string;
  alias: string;
  _type: "table";
}
interface ITernaryQE extends IQueryExpression {
  predicate: IAndQE | IOrQE | IPredicateQE;
  trueExpression:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  falseExpression:
    | IAggregateQE
    | IBinaryQE
    | ICaseQE
    | ICastQE
    | IColumnQE
    | IConstantQE
    | ISingleQE
    | ITernaryQE;
  alias: string;
  _type: "ternary";
}
