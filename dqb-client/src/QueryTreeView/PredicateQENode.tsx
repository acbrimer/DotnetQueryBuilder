import React from "react";
import QEItem from "./QEItem";
import QENode from "./QENode";
import PropertyNode from "./PropertyNode";

type PredicateQEProps = {
  node: IPredicateQE;
  nodeId: any;
};

const PredicateQENode = (props: PredicateQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEItem label={`Predicate`} nodeId={nodeId}>
      <QENode node={node.left} nodeId={`${nodeId}.left`} />
      <PropertyNode
        qeName="Operator"
        qeValue={node.operator}
        nodeId={`${nodeId}.operator`}
      />
      <QENode node={node.right} nodeId={`${nodeId}.right`} />
    </QEItem>
  );
};

export default PredicateQENode;
