import * as React from "react";
import { TreeView, TreeItem } from "@mui/lab";
import { Typography, Icon } from "@mui/material";
import AggregateQENode from "./AggregateQENode";
import BinaryQENode from "./BinaryQENode";
import ColumnQENode from "./ColumnQENode";
import TableQENode from "./TableQENode";
import SelectQENode from "./SelectQENode";
import StyledTreeItem from "./QEItem";

export interface QENodeProps {
  node: IQueryExpression;
  nodeId: any;
}

const QENode = (props: QENodeProps) => {
  const { node, nodeId } = props;

  const renderNode = (node: IQueryExpression) => {
    const { _type } = node;
    switch (_type) {
      case "aggregate":
        return <AggregateQENode node={node as IAggregateQE} {...{ nodeId }} />;
      case "binary":
        return <BinaryQENode node={node as IBinaryQE} {...{ nodeId }} />;
      case "column":
        return <ColumnQENode node={node as IColumnQE} {...{ nodeId }} />;
      case "table":
        return <TableQENode node={node as ITableQE} {...{ nodeId }} />;
      case "join":
        return <TableQENode node={node as ITableQE} {...{ nodeId }} />;
      case "select":
        return <SelectQENode node={node as ISelectQE} {...{ nodeId }} />;
      default:
        return <div>Unmapped node type</div>;
    }
  };

  return <>{renderNode(node)}</>;
};

export default QENode;
