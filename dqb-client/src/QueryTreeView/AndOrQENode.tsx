import React from "react";
import QEItem from "./QEItem";
import QENode from "./QENode";


type AndOrQEProps = {
  node: IAndQE | IOrQE;
  nodeId: any;
};

const AndOrQENode = (props: AndOrQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEItem label={node._type.toUpperCase()} nodeId={nodeId}>
      {node.expressions.map((ex, ix) => (
        <QENode node={ex} nodeId={`${nodeId}[${ix}]`} />
      ))}
    </QEItem>
  );
};

export default AndOrQENode;
