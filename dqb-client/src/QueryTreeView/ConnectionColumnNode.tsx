import * as React from "react";

import { TreeItemProps } from "@mui/lab/TreeItem";
import { IConnectionTableRecord } from "../resources/ConnectionTables";
import TableReference from "./TableReference";
import ColumnNode, { ColumnTreeItem } from "./ColumnNode";
import { IConnectionColumnRecord } from "../resources/ConnectionColumns";
import { Typography } from "@mui/material";

interface ConnectionColumnNodeProps
  extends Omit<TreeItemProps, "id" | "nodeId"> {
  data: IConnectionColumnRecord;
}

const ConnectionColumnNode = (props: ConnectionColumnNodeProps) => {
  const { data } = props;
  const {
    id,
    column,
    columnAlias,
    tableAlias,
    table,
    catalog,
    schema,
    connection,
    name
  } = data;

  return (
    <ColumnTreeItem
      label={
        <Typography fontSize="small" fontWeight="bold" fontFamily="monospace">
          {name}
        </Typography>
      }
      nodeId={id}
    >
      {column}
    </ColumnTreeItem>
  );
};

export default ConnectionColumnNode;
