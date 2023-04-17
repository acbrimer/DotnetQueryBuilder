import * as React from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { TreeItemProps } from "@mui/lab/TreeItem";
import { Box, Typography } from "@mui/material";
import {
  IQueryTreeViewContext,
  withTreeViewContext,
} from "./QueryTreeViewContext";
import { IconButtonWithTooltip, TextInput } from "react-admin";
import { PropertyTreeItem } from "./styledTreeItems";

export interface PropertyNodeProps
  extends TreeItemProps,
    IQueryTreeViewContext {
  qeName: string;
  qeValue: any;
  InputComponent?: JSX.Element;
}

export const PropertyNodeComponent = (props: PropertyNodeProps) => {
  const { qeName, qeValue } = props;
  return (
    <Box display="inline-flex" flexDirection="row" maxHeight={24}>
      <Typography color="textSecondary" variant="caption">
        {qeName}:&nbsp;
      </Typography>
      <Typography lineHeight={1.3} variant="body2">
        {qeValue}
      </Typography>
    </Box>
  );
};

export const PropertyNodeInput = (props: PropertyNodeProps) => {
  const {
    nodeId,
    qeValue,
    qeName,
    deselectNode,
    InputComponent,
    defaultValue,
  } = props;

  const handleCancelPropertyEdit = React.useCallback(() => {
    setTimeout(() => {
      deselectNode(nodeId);
    }, 20);
  }, [deselectNode, nodeId]);

  const inputProps = React.useMemo(
    () => ({
      endAdornment: (
        <IconButtonWithTooltip
          size="small"
          onClick={handleCancelPropertyEdit}
          label="Cancel edit"
        >
          <CancelIcon fontSize="small" />
        </IconButtonWithTooltip>
      ),
    }),
    [handleCancelPropertyEdit]
  );
  if (InputComponent !== null && InputComponent !== undefined) {
    return React.cloneElement(InputComponent as JSX.Element, {
      source: nodeId,
      variant: "standard",
      helperText: false,
      defaultValue: qeValue || defaultValue,
    });
  }
  return (
    <TextInput
      InputProps={inputProps}
      helperText={false}
      variant="standard"
      size="small"
      source={nodeId}
      defaultValue={qeValue || defaultValue}
      label={qeName}
    />
  );
};

const PropertyNode = (props: PropertyNodeProps) => {
  const { selectedNodeId } = props;

  return (
    <PropertyTreeItem
      {...props}
      label={
        selectedNodeId === props.nodeId ? (
          <PropertyNodeInput {...props} />
        ) : (
          <PropertyNodeComponent {...props} />
        )
      }
    />
  );
};

export default withTreeViewContext(PropertyNode);
