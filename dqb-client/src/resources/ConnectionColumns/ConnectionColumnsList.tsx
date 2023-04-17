
// src/resources/connectioncolumns/ConnectionColumnsList.tsx
import * as React from "react";
import {
  ArrayField,
  BooleanField,
  ChipField,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from "react-admin";

const ConnectionColumnsList = () => {
  return (
    <List>
      <Datagrid></Datagrid>
    </List>
  );
};

export default ConnectionColumnsList;

