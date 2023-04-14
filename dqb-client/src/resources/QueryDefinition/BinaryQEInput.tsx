import * as React from "react";
import { useInput, InputProps, TextInput } from "react-admin";
import ColumnQEInput from "./ColumnQEInput";

const BinaryQEInput = () => {
  return (
    <>
      <TextInput source="_type" value="binary" disabled />
      <ColumnQEInput source="left" />
      <ColumnQEInput source="right" />
    </>
  );
};

export default BinaryQEInput;
