import * as React from "react";
import { useInput, InputProps, TextInput } from "react-admin";



const ColumnExpressionInput = () => {

  return (
    <>
      <TextInput source="alias" label="Column" />
    </>
  );
};

export default ColumnExpressionInput;
