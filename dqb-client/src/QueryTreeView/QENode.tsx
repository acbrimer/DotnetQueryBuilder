import * as React from "react";
import AggregateQENode from "./AggregateQENode";
import BinaryQENode from "./BinaryQENode";
import ColumnQENode from "./ColumnQENode";
import TableQENode from "./TableQENode";
import SelectQENode from "./SelectQENode";
import JoinQENode from "./JoinQENode";
import AndOrQENode from "./AndOrQENode";
import PredicateQENode from "./PredicateQENode";

export interface QENodeProps {
  node: IQueryExpression;
  nodeId: any;
}

const QENode = (props: QENodeProps) => {
  const { node, nodeId } = props;

  const renderNode = (node: IQueryExpression) => {
    const { _type } = node;
    switch (_type) {
      case "aggregate":
        return <AggregateQENode node={node as IAggregateQE} {...{ nodeId }} />;
      case "binary":
        return <BinaryQENode node={node as IBinaryQE} {...{ nodeId }} />;
      case "column":
        return <ColumnQENode node={node as IColumnQE} {...{ nodeId }} />;
      case "table":
        return <TableQENode node={node as ITableQE} {...{ nodeId }} />;
      case "join":
        return <JoinQENode node={node as IJoinQE} {...{ nodeId }} />;
      case "select":
      case "single":
        return <SelectQENode node={node as ISelectQE} {...{ nodeId }} />;
      case "predicate":
        return <PredicateQENode node={node as IPredicateQE} {...{ nodeId }} />;
      case "and":
      case "or":
        return <AndOrQENode node={node as IAndQE | IOrQE} {...{ nodeId }} />;
      default:
        return <div>Unmapped node type</div>;
    }
  };

  return <>{renderNode(node)}</>;
};

export default QENode;
