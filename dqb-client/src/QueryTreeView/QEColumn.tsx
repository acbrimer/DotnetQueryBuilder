import * as React from "react";
import { alpha, lighten, styled } from "@mui/material/styles";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import { TransitionComponent } from "./treeViewFunctions";

type QEColumnProps = TreeItemProps & {
  columnType?: "db" | "calc";
};

const QEColumn = styled((props: QEColumnProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme, columnType }) => ({
  [`& > .${treeItemClasses.content}`]: {
    width: "fit-content",
    backgroundColor:
      columnType === "calc"
        ? lighten(theme.palette.info.light, 0.9)
        : lighten(theme.palette.info.light, 0.75),
    borderColor: theme.palette.info.light,
    borderWidth: 1,
    borderStyle:
      columnType === "db"
        ? "ridge"
        : columnType === "calc"
        ? "dotted"
        : "solid",
    borderRadius: 4,
    marginBottom: 4,
  },
  [`& > .${treeItemClasses.iconContainer}`]: {
    display: "none",
  },
  [`& > .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default QEColumn;
