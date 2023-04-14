import * as React from "react";
import QEColumn from "./QEColumn";
import QEItem from "./QEItem";
import QENode from "./QENode";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

type BinaryQEProps = {
  node: IBinaryQE;
  nodeId: any;
};

const BinaryQENode = (props: BinaryQEProps) => {
  const { node, nodeId } = props;
  return (
    <QEColumn
      columnType="calc"
      label={`${node.alias ? node.alias : "(unnamed)"} [${node._type}]`}
      nodeId={nodeId}
      expandIcon={<ArrowDropUpIcon fontSize="inherit" />}
      collapseIcon={<ArrowDropDownIcon fontSize="inherit" />}
    >
      <QENode node={node.left} nodeId={`${nodeId}.left`} />
      <QEItem
        label={`Operator: ${node.operator}`}
        nodeId={`${nodeId}.operator`}
        itemType="Property"
      />
      <QENode node={node.right} nodeId={`${nodeId}.right`} />
    </QEColumn>
  );
};

export default BinaryQENode;
