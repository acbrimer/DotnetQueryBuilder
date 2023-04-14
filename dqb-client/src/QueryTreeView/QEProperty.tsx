import * as React from "react";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
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

const QEProperty = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& .${treeItemClasses.label}`]: {
    ...theme.typography.caption,
  },
  [`& .${treeItemClasses.content}`]: {
    width: "fit-content",
    borderRadius: 0,
    marginBottom: 4,
    maxHeight: 24,
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

export default QEProperty;
