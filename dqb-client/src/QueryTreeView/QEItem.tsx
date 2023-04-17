import * as React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import { TransitionComponent } from "./treeViewFunctions";

type QEItemProps = TreeItemProps & {
  itemType?: string;
};

const QEItem = styled((props: QEItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme, itemType }) => ({
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

export default QEItem;
