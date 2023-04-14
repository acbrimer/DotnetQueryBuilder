import React from "react";
import QENode from "./QENode";
import QEItem from "./QEItem";

type AggregateQEProps = {
  node: IAggregateQE;
  nodeId: any;
};

const AggregateQENode = (props: AggregateQEProps) => {
  const { node, nodeId } = props;

  return (
    <QEItem
      label={`${node.alias ? node.alias : ""} [${node._type}]`}
      {...{ nodeId }}
    >
      <QEItem
        label={`Function: ${node.function}`}
        nodeId={`${nodeId}.function`}
        itemType="Property"
      />
      <QEItem
        label={`Alias: ${node.alias}`}
        nodeId={`${nodeId}.alias`}
        itemType="Property"
      />
      <QENode node={node.expression} nodeId={`${nodeId}.expression`} />
    </QEItem>
  );
};

export default AggregateQENode;
