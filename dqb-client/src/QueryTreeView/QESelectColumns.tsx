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

const QESelectColumns = styled((props: TreeItemProps) => (
  <TreeItem {...props} TransitionComponent={TransitionComponent} />
))(({ theme }) => ({
  [`& > .${treeItemClasses.content}`]: {
    marginBottom: 4,
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export default QESelectColumns;