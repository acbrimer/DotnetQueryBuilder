interface IQueryExpressionVisitor {
  // _sqlIdentifiers: string[];
  Visit: (expression: IQueryExpression) => void;
  Visit_TableQE: (table: ITableQE) => void;
  Visit_SelectQE: (select: ISelectQE) => void;
  Visit_ColumnQE: (column: IColumnQE) => void;
  Visit_BinaryQE: (binary: IBinaryQE) => void;
  Visit_ConstantQE: (constant: IConstantQE) => void;
  Visit_JoinQE: (join: IJoinQE) => void;
  Visit_PredicateQE: (predicate: IPredicateQE) => void;
  Visit_AndQE: (and: IAndQE) => void;
  Visit_OrQE: (or: IOrQE) => void;
  Visit_CastQE: (cast: ICastQE) => void;
  Visit_ConcatQE: (concat: IConcatQE) => void;
  Visit_TernaryQE: (ternaryQE: ITernaryQE) => void;
  Visit_CaseConditionQE: (caseConditionQE: ICaseConditionQE) => void;
  Visit_CaseQE: (caseQE: ICaseQE) => void;
  Visit_GroupByQE: (groupByQE: IGroupByQE) => void;
  Visit_AggregateQE: (aggregateQE: IAggregateQE) => void;
  Visit_OrderByQE: (orderByQE: IOrderByQE) => void;
}

export default IQueryExpressionVisitor;
