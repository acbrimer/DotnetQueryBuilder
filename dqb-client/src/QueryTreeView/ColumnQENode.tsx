import React from "react";
import QEItem from "./QEItem";
import QEColumn from "./QEColumn";
import QEProperty from "./QEProperty";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type ColumnQEProps = {
  node: IColumnQE;
  nodeId: any;
};

const ColumnQENode = (props: ColumnQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEColumn
      columnType="db"
      expandIcon={<ArrowDropUpIcon fontSize="inherit" />}
      collapseIcon={<ArrowDropDownIcon fontSize="inherit" />}
      label={`${node.alias || node.name}`}
      nodeId={nodeId}
    >
      <QEProperty
        label={`Name: ${node.table}`}
        nodeId={`${nodeId}.name`}
        itemType="Property"
      />
      {node.table && (
        <QEProperty
          label={`Table: ${node.table}`}
          nodeId={`${nodeId}.table`}
          itemType="Property"
        />
      )}
      {node.alias && (
        <QEProperty
          label={`Alias: ${node.alias}`}
          nodeId={`${nodeId}.alias`}
          itemType="Property"
        />
      )}
    </QEColumn>
  );
};

export default ColumnQENode;
