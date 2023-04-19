import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import { TransitionComponent } from "./treeViewFunctions";
import { IConnectionTableRecord } from "../resources/ConnectionTables";
import TableReference from "./TableReference";
import { Loading, useGetManyReference } from "react-admin";
import { IConnectionColumnRecord } from "../resources/ConnectionColumns";
import ConnectionColumnNode from "./ConnectionColumnNode";
import { TableIcon } from "./treeViewIcons";

const ConnectionTableTreeItem = styled((props: any) => (
  <TreeItem
    {...props}
    expandIcon={<TableIcon />}
    collapseIcon={<TableIcon />}
    TransitionComponent={TransitionComponent}
  />
))(({ theme }) => ({
  [`& > .${treeItemClasses.content}`]: {
    marginBottom: 4,
    [`& > .${treeItemClasses.iconContainer}`]: {
      "& svg": { color: deepPurple[900] },
      "& .close": {
        opacity: 0.3,
      },
    },
  },

  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

interface ConnectionTableNodeProps
  extends Omit<TreeItemProps, "id" | "nodeId"> {
  data: IConnectionTableRecord;
}

const ConnectionTableNode = (props: ConnectionTableNodeProps) => {
  const { data } = props;
  const { table, catalog, schema, connection, id } = data;

  return (
    <ConnectionTableTreeItem
      label={<TableReference {...{ table, catalog, schema, connection }} />}
      nodeId={id}
    >
      {data?.columns.map((columnRecord: IConnectionColumnRecord) => (
        <ConnectionColumnNode data={columnRecord} />
      ))}
    </ConnectionTableTreeItem>
  );
};

export default ConnectionTableNode;
