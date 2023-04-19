import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import QENode, { QENodeProps } from "./QENode";
import { QueryTreeViewContext } from "./QueryTreeViewContext";
import { LoadingIndicator, useGetList } from "react-admin";
import { MinusSquare, PlusSquare, CloseSquare } from "./treeViewIcons";
import { IConnectionRecord } from "../resources/Connections";
import ConnectionNode from "./ConnectionNode";

function ConnectionsTreeView(props: any) {
  const treeRef = React.createRef<any>();

  const { data, isLoading, error } = useGetList("connections", {
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
    <>
      <TreeView
        ref={treeRef}
        aria-label="customized"
        defaultExpanded={data?.map((r) => r.id)}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        sx={{ height: "100%", flexGrow: 1, width: "100%", overflowY: "auto" }}
      >
        {data?.map((connectionRecord: IConnectionRecord) => (
          <ConnectionNode {...connectionRecord} />
        ))}
      </TreeView>
    </>
  );
}

export default ConnectionsTreeView;
