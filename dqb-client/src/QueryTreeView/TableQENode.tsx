import React from "react";
import QEItem from "./QEItem";
import QEProperty from "./QEProperty";

type TableQEProps = {
  node: ITableQE;
  nodeId: any;
};

const TableQENode = (props: TableQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEItem label={`Table: ${node.alias || node.table}`} nodeId={nodeId}>
      {node.catalog && (
        <QEProperty
          label={`Catalog: ${node.catalog}`}
          nodeId={`${nodeId}.catalog`}
          itemType="Property"
        />
      )}
      {node.schema && (
        <QEProperty
          label={`Schema: ${node.schema}`}
          nodeId={`${nodeId}.schema`}
          itemType="Property"
        />
      )}
      <QEProperty
        label={`Name: ${node.table}`}
        nodeId={`${nodeId}.table`}
        itemType="Property"
      />
      <QEProperty
        label={`Alias: ${node.alias}`}
        nodeId={`${nodeId}.alias`}
        itemType="Property"
      />
    </QEItem>
  );
};

export default TableQENode;
