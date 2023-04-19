import * as React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import { TransitionComponent } from "./treeViewFunctions";
import { IConnectionRecord } from "../resources/Connections";
import { LoadingIndicator, useGetOne } from "react-admin";
import ConnectionCatalogNode from "./ConnectionCatalogNode";
import { IConnectionTableRecord } from "../resources/ConnectionTables";
import { PostgresIcon, SqliteIcon } from "./treeViewIcons";
import { IConnectionCatalogRecord } from "../resources/ConnectionCatalogs";

const CONNECTION_ICONS: any = {
  postgres: <PostgresIcon />,
  sqlite: <SqliteIcon />,
};

const ConnectionTreeItem = styled((props: any) => (
  <TreeItem
    {...props}
    expandIcon={CONNECTION_ICONS[props.provider]}
    collapseIcon={CONNECTION_ICONS[props.provider]}
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
    marginLeft: 8,
    paddingLeft: 8,
    // borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

interface ConnectionNodeProps
  extends Omit<TreeItemProps, "id" | "nodeId">,
    IConnectionRecord {}

const ConnectionNode = (props: ConnectionNodeProps) => {
  const { name, id, provider } = props;

  const { data, isLoading, error } = useGetOne<any>("connectionSchema", {
    id: id,
  });
  if (isLoading) {
    return <LoadingIndicator />;
  }
  if (error) {
    return <p>ERROR</p>;
  }
  return (
    <ConnectionTreeItem label={id} nodeId={data.id} provider={provider}>
      {data?.catalogs.map((catalog: IConnectionCatalogRecord) => (
        <ConnectionCatalogNode data={catalog} />
      ))}
    </ConnectionTreeItem>
  );
};

export default ConnectionNode;
