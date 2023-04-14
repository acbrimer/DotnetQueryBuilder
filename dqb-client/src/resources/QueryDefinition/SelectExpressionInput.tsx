import * as React from "react";
import {
  useInput,
  InputProps,
  TextInput,
  ArrayInput,
  SimpleFormIterator,
  useSimpleFormIteratorItem,
} from "react-admin";
import { IconButton, Theme } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

const SelectExpressionColumn = () => {
  const { index, total, reOrder } = useSimpleFormIteratorItem();
  return (
    <>
      <TextInput source={`column.table`} label="Table" />
      <TextInput source={`column.column`} label="Column" />
    </>
  );
};

const SelectExpressionInput = (props: InputProps) => {
  const input = useInput(props);

  return (
    <>
      <TextInput source={`${props.source}.alias`} label="Alias" />
      <ArrayInput source={`${props.source}.columns`} label="Columns">
        <SimpleFormIterator>
          <TextInput source={"table"} label="Table" />
          <TextInput source={"column"} label="Column" />
        </SimpleFormIterator>
      </ArrayInput>
    </>
  );
};
export default SelectExpressionInput;
