import * as React from "react";
import { alpha, styled } from "@mui/material/styles";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import { TransitionComponent } from "./treeViewFunctions";

export const PropertyTreeItem = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.label}`]: {
    ...theme.typography.caption,
  },
  [`& .${treeItemClasses.content}`]: {
    width: "fit-content",
    borderRadius: 0,
    marginBottom: 4,
    height: "fit-content",
    position: "relative",
    backgroundColor: theme.palette.grey[50],
    overflow: "hidden",
  },
  [`& .${treeItemClasses.content}:before`]: {
    content: "''",
    width: 10,
    height: 10,
    transform: "rotate(45deg)",
    top: 1,
    borderRadius: 1,
    left: -6,
    backgroundColor: theme.palette.info.main,
    position: "absolute",
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    display: "none",
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));
