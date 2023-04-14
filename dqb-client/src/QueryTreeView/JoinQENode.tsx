import React from "react";
import QEItem from "./QEItem";
import QENode from "./QENode";
import QEProperty from "./QEProperty";

type JoinQEProps = {
  node: IJoinQE;
  nodeId: any;
};

const JoinQENode = (props: JoinQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEItem label={`${node.joinType} JOIN `} nodeId={nodeId}>
      <QENode node={node.target} nodeId={`${nodeId}.target`} />
      <QENode node={node.condition} nodeId={`${nodeId}.condition`} />
      <QEProperty
        label={`Type: ${node.joinType}`}
        nodeId={`${nodeId}.joinType`}
      />
    </QEItem>
  );
};

export default JoinQENode;
