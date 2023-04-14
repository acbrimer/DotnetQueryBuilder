import * as React from "react";
import { useInput, InputProps, TextInput } from "react-admin";

const ColumnExpressionInput = (props: InputProps) => {
  const { source } = props;
  return (
    <>
      <TextInput source={`${source}._type`} value="column" disabled />
      <TextInput source={`${source}.table`} label="Table" />
      <TextInput source={`${source}.column`} label="Column" />
    </>
  );
};

export default ColumnExpressionInput;
