import React from "react";
import PropertyNode from "./PropertyNode";

type ColumnQEProps = {
  node: IColumnQE;
  nodeId: any;
};

const ColumnQENode = (props: ColumnQEProps) => {
  const { node, nodeId } = props;
  return (
    <>
      <PropertyNode
        qeName="Name"
        qeValue={node.name}
        nodeId={`${nodeId}.name`}
      />
      {node.table && (
        <PropertyNode
          qeName="Table"
          qeValue={node.table}
          nodeId={`${nodeId}.table`}
        />
      )}
      <PropertyNode
        qeName="Alias"
        qeValue={node.alias}
        nodeId={`${nodeId}.alias`}
        defaultValue={node.name}
      />
    </>
  );
};

export default ColumnQENode;
