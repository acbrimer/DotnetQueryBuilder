import * as React from "react";

import { alpha, styled } from "@mui/material/styles";
import Typography, {
  TypographyProps,
  typographyClasses,
} from "@mui/material/Typography";
import { Box, Tooltip, Theme } from "@mui/material";

const TableReferenceTypography = styled((props: any) => (
  <Typography {...props} component="div" />
))(({ theme, type }) => ({
  fontWeight: (theme as Theme).typography.fontWeightBold,
  fontFamily: "monospace",
  width: "fit-content",
  flexGrow: 1,
  marginRight: type === "table" ? 0 : 4,
}));

interface TableReferenceProps {
  table?: string;
  schema?: string;
  catalog?: string;
  connection?: string;
}

const TableReference = (props: TableReferenceProps) => {
  const { table, schema, catalog } = props;

  return (
    <Box display="inline-flex">
      <TableReferenceTypography type="table">{table}</TableReferenceTypography>
    </Box>
  );
};

export default TableReference;
