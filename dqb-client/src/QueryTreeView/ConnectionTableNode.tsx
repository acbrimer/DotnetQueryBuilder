import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
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
  },
  [`& > .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

interface ConnectionTableNodeProps
  extends IConnectionTableRecord,
    Omit<TreeItemProps, "id" | "nodeId"> {}

const ConnectionTableNode = (props: ConnectionTableNodeProps) => {
  const { table, catalog, schema, connection, id } = props;

  const { data, isLoading, error } = useGetManyReference("connectionColumns", {
    target: "tableId",
    id: id,
    pagination: { page: 1, perPage: 100 },
    sort: { field: "id", order: "ASC" },
  });
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <p>ERROR</p>;
  }

  return (
    <ConnectionTableTreeItem
      label={<TableReference {...{ table, catalog, schema, connection }} />}
      nodeId={id}
    >
      {data?.map((columnRecord: IConnectionColumnRecord) => (
        <ConnectionColumnNode {...columnRecord} />
      ))}
    </ConnectionTableTreeItem>
  );
};

export default ConnectionTableNode;
