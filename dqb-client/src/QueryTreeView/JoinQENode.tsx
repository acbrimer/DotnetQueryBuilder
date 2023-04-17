import React from "react";
import QEItem from "./QEItem";
import QENode from "./QENode";
import PropertyNode from "./PropertyNode";

type JoinQEProps = {
  node: IJoinQE;
  nodeId: any;
};

const JoinQENode = (props: JoinQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEItem
      label={`${node.joinType.toUpperCase()} JOIN ${
        node.target._type === "table"
          ? (node.target as ITableQE).table
          : "(SELECT ...)"
      }`}
      nodeId={nodeId}
    >
      <QENode node={node.target} nodeId={`${nodeId}.target`} />
      <QENode node={node.condition} nodeId={`${nodeId}.condition`} />
      <PropertyNode
        qeName="Type"
        qeValue={node.joinType}
        nodeId={`${nodeId}.joinType`}
      />
    </QEItem>
  );
};

export default JoinQENode;
