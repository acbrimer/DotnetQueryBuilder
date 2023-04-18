import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import { deepOrange } from "@mui/material/colors";

import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import { TransitionComponent } from "./treeViewFunctions";
import { LoadingIndicator, useGetManyReference } from "react-admin";
import ConnectionTableNode from "./ConnectionTableNode";
import { IConnectionTableRecord } from "../resources/ConnectionTables";
import { DatabaseIcon } from "./treeViewIcons";
import { IConnectionCatalogRecord } from "../resources/ConnectionCatalogs";

const ConnectionCatalogTreeItem = styled((props: any) => (
  <TreeItem
    {...props}
    expandIcon={<DatabaseIcon color="inherit" />}
    collapseIcon={<DatabaseIcon color="inherit" />}
    TransitionComponent={TransitionComponent}
  />
))(({ theme }) => ({
  [`& > .${treeItemClasses.content}`]: {
    marginBottom: 4,
    [`& > .${treeItemClasses.iconContainer}`]: {
      "& svg": { color: deepOrange[900] },
      "& .close": {
        opacity: 0.3,
      },
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 8,
    paddingLeft: 8,
    borderLeft: `1px solid ${alpha(deepOrange[900], 0.4)}`,
  },
}));

interface ConnectionCatalogNodeProps
  extends Omit<TreeItemProps, "id" | "nodeId">,
    IConnectionCatalogRecord {}

const ConnectionCatalogNode = (props: ConnectionCatalogNodeProps) => {
  const { catalog, id } = props;

  const { data, isLoading, error } = useGetManyReference("local/connectionTables", {
    target: "catalogId",
    id: id,
    pagination: { page: 1, perPage: 100 },
    sort: { field: "id", order: "ASC" },
  });
  if (isLoading) {
    return <LoadingIndicator />;
  }
  if (error) {
    return <p>ERROR</p>;
  }
  return (
    <ConnectionCatalogTreeItem label={catalog} nodeId={id}>
      {data && data.length > 0 ? (
        data?.map((tableRecord: IConnectionTableRecord) => (
          <ConnectionTableNode {...tableRecord} />
        ))
      ) : (
        <p>No tables in catalog</p>
      )}
    </ConnectionCatalogTreeItem>
  );
};

export default ConnectionCatalogNode;
