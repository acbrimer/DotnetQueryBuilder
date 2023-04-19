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
  extends Omit<TreeItemProps, "id" | "nodeId"> {
  data: IConnectionCatalogRecord;
}

const ConnectionCatalogNode = (props: ConnectionCatalogNodeProps) => {
  const { data } = props;
  const { catalog, id, tables } = data;

  return (
    <ConnectionCatalogTreeItem label={catalog} nodeId={id}>
      {tables && tables.length > 0 ? (
        tables?.map((tableRecord: IConnectionTableRecord) => (
          <ConnectionTableNode data={tableRecord} />
        ))
      ) : (
        <p>No tables in catalog</p>
      )}
    </ConnectionCatalogTreeItem>
  );
};

export default ConnectionCatalogNode;
