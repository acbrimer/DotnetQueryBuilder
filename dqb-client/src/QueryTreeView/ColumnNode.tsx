import * as React from "react";
import { alpha, lighten, styled } from "@mui/material/styles";
import { Box, Typography, IconButton, TextField } from "@mui/material";
import TreeItem, { TreeItemProps, treeItemClasses } from "@mui/lab/TreeItem";
import {
  IconButtonWithTooltip,
  TextInput,
  Form,
  SaveButton,
  useInput,
} from "react-admin";
import { useWatch } from "react-hook-form";
import { TransitionComponent } from "./treeViewFunctions";
import {
  IQueryTreeViewContext,
  withTreeViewContext,
} from "./QueryTreeViewContext";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QENode from "./QENode";
import PropertyNode from "./PropertyNode";
import QueryExpression from "../QueryExpression/QueryExpression";
import QueryExpressionParser from "../QueryExpression/Parsers/QueryExpressionParser";
import ColumnEditorInput from "./ColumnEditorInput";

export interface ColumnNodeProps extends TreeItemProps, IQueryTreeViewContext {
  nodeId: string;
  node: ColumnQEType;
  ordinalPosition?: number;
  columnDefinition?: IDbColumnDefinition;
  columnType?: "db" | "calc";
  InputComponent?: JSX.Element;
}

export const ColumnTreeItem = styled((props: any) => (
  <TreeItem
    {...props}
    expandIcon={<ArrowDropUpIcon fontSize="inherit" />}
    collapseIcon={<ArrowDropDownIcon fontSize="inherit" />}
    TransitionComponent={TransitionComponent}
  />
))(({ theme, columnType }) => ({
  "&:hover .column-edit-button": {
    opacity: 1,
  },
  "& .column-edit-button": {
    opacity: 0,
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeOut,
    }),
  },
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
  [`& > .${treeItemClasses.label}`]: {
    fontFamily: "monospace",
  },
  [`& > .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

export const ColumnNodeComponent = (
  props: ColumnNodeProps & {
    handleColumnEdit: (e: any) => void;
    columnName: string;
  }
) => {
  const { node, nodeId, handleColumnEdit, columnName } = props;

  return (
    <Box position="relative" width="100%">
      <Typography>{columnName}</Typography>
      <IconButton
        onClick={handleColumnEdit}
        size="small"
        sx={{ position: "absolute", right: -28, top: -4, fontSize: 12 }}
        className="column-edit-button"
      >
        <EditIcon fontSize="inherit" />
      </IconButton>
    </Box>
  );
};

export const ColumnNodeInput = (
  props: ColumnNodeProps & {
    handleCloseEdit: () => void;
    onChange: (val: any) => void;
    columnName: string;
  }
) => {
  const { onChange, handleCloseEdit, node } = props;

  const [stringVal, setStringVal] = React.useState(
    new QueryExpression(node).ToSql().trimStart()
  );

  const handleCancelPropertyEdit = React.useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      handleCloseEdit();
    },
    [handleCloseEdit]
  );

  const handleSave = React.useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        const qe = new QueryExpressionParser().Parse(stringVal);
        onChange(qe);
        handleCloseEdit();
      } catch {
        handleCloseEdit();
      }
    },
    [handleCloseEdit, onChange, stringVal]
  );

  const inputError = React.useMemo(() => {
    try {
      new QueryExpressionParser().Parse(stringVal);
      return null;
    } catch (e: any) {
      return e.message;
    }
  }, [stringVal]);

  const handleInputChange = React.useCallback((v: any) => {
    setStringVal(v);
  }, []);

  return (
    <Box
      height="fit-content"
      display="flex"
      flexDirection="row"
      sx={{
        marginTop: 0.5,
        marginBottom: 0.5,
        paddingTop: 0.25,
        paddingBottom: 0.25,
      }}
      onClick={(e: any) => e.stopPropagation()}
    >
      <ColumnEditorInput
        onChange={handleInputChange}
        defaultValue={stringVal}
      />
      <Box>
        <IconButton
          disabled={inputError}
          onClick={handleSave}
          size="small"
          color="success"
        >
          <CheckCircleIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          onClick={handleCancelPropertyEdit}
          size="small"
          color="error"
        >
          <CancelIcon fontSize="inherit" />
        </IconButton>
      </Box>
    </Box>
  );
};

const ColumnNode = (props: ColumnNodeProps) => {
  const { nodeId, columnDefinition, ordinalPosition } = props;
  const [editMode, setEditMode] = React.useState(false);
  const [sqlValue, setSqlValue] = React.useState("");
  const node = useWatch({ name: nodeId.replace("-col", "") });
  const {
    field: { onChange },
  } = useInput({ source: nodeId.replace("-col", "") });

  const columnName = React.useMemo(() => {
    if (node.alias) return node.alias;
    if (node._type === "column" && (node as any).name)
      return (node as any).name;
    if (ordinalPosition) return `Column${ordinalPosition}`;
    return null;
  }, [node, ordinalPosition]);

  const handleColumnEdit = React.useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setSqlValue(new QueryExpression(node).ToSql());
      setEditMode(true);
    },
    [node]
  );

  const handleCloseEdit = React.useCallback(() => {
    setEditMode(false);
  }, []);

  const columnDefinitionProps = React.useMemo(
    () => (
      <>
        {columnDefinition &&
          Object.keys(columnDefinition || {}).map((k) => (
            <PropertyNode
              nodeId={`${nodeId}.${k}`}
              qeName={k}
              qeValue={(columnDefinition as any)[k]}
            />
          ))}
      </>
    ),
    [columnDefinition, nodeId]
  );

  const labelComponent = React.useMemo(
    () =>
      editMode ? (
        <ColumnNodeInput
          {...props}
          node={node}
          onChange={onChange}
          defaultValue={sqlValue}
          columnName={columnName}
          handleCloseEdit={handleCloseEdit}
        />
      ) : (
        <ColumnNodeComponent
          {...props}
          node={node}
          columnName={columnName}
          handleColumnEdit={handleColumnEdit}
        />
      ),
    [
      columnName,
      editMode,
      handleCloseEdit,
      handleColumnEdit,
      node,
      onChange,
      props,
      sqlValue,
    ]
  );

  return (
    <ColumnTreeItem {...props} label={labelComponent} nodeId={`${nodeId}-col`}>
      <QENode {...props} />
      {columnDefinitionProps}
    </ColumnTreeItem>
  );
};

ColumnNode.defaultProps = {
  columnDefinition: {
    description: "This is the column description",
    nativeType: "varchar",
  },
} as Partial<ColumnNodeProps>;

export default withTreeViewContext(ColumnNode);
