import React from "react";
import QEItem from "./QEItem";
import PropertyNode from "./PropertyNode";

type TableQEProps = {
  node: ITableQE;
  nodeId: any;
};

const TableQENode = (props: TableQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEItem label={`Table: ${node.alias || node.table}`} nodeId={nodeId}>
      {node.catalog && (
        <PropertyNode
          qeName="Catalog"
          qeValue={node.catalog}
          nodeId={`${nodeId}.catalog`}
          itemType="Property"
        />
      )}
      {node.schema && (
        <PropertyNode
          qeName="Schema"
          qeValue={node.schema}
          label={`Schema: ${node.schema}`}
          nodeId={`${nodeId}.schema`}
        />
      )}
      <PropertyNode
        qeName="Name"
        qeValue={node.table}
        nodeId={`${nodeId}.table`}
      />
      <PropertyNode
        qeName="Alias"
        qeValue={node.alias}
        nodeId={`${nodeId}.alias`}
      />
    </QEItem>
  );
};

export default TableQENode;
