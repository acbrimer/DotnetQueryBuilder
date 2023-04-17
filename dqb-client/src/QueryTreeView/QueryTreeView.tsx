import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import TreeView from "@mui/lab/TreeView";
import QENode, { QENodeProps } from "./QENode";
import { QueryTreeViewContext } from "./QueryTreeViewContext";
import { useInput } from "react-admin";
import { MinusSquare, PlusSquare, CloseSquare } from "./treeViewIcons";

interface QueryTreeViewProps extends Omit<QENodeProps, "nodeId"> {
  source: string;
}

function QueryTreeView(props: any) {
  const { source } = props;
  const {
    field: { value },
  } = useInput(props);
  const [selectedNodeId, setSelectedNodeId] = React.useState<any>(null);
  const treeRef = React.createRef<any>();

  const handleNodeToggle = (e: any, id: any) => {
    setSelectedNodeId(id);
  };

  const deselectNode = (id: any) => {
    setSelectedNodeId(null);
    if (treeRef.current) {
      treeRef.current.selected = [];
    }
  };

  return (
    <QueryTreeViewContext.Provider value={{ selectedNodeId, deselectNode }}>
      <TreeView
        ref={treeRef}
        defaultExpanded={[
          source,
          `${source}.columns`,
          `${source}-from`,
          `${source}-where`,
        ]}
        onNodeSelect={handleNodeToggle}
        aria-label="customized"
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        sx={{ height: "100%", flexGrow: 1, width:"100%", overflowY: "auto" }}
      >
        <QENode nodeId={source} node={value} />
      </TreeView>
    </QueryTreeViewContext.Provider>
  );
}

export default QueryTreeView;
