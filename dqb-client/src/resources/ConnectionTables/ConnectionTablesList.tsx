
// src/resources/connectiontables/ConnectionTablesList.tsx
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

const ConnectionTablesList = () => {
  return (
    <List>
      <Datagrid></Datagrid>
    </List>
  );
};

export default ConnectionTablesList;

