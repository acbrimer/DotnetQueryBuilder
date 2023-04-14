import * as React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { alpha, lighten, styled } from "@mui/material/styles";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import Collapse from "@mui/material/Collapse";
import { useSpring, animated } from "@react-spring/web";
import { TransitionProps } from "@mui/material/transitions";

function TransitionComponent(props: TransitionProps) {
  const style = useSpring({
    from: {
      opacity: 0,
      transform: "translate3d(20px,0,0)",
    },
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

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
    // boxShadow: columnType === "calc" ? theme.shadows[2] : "none",
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
