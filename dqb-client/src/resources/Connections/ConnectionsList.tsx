// src/resources/connections/ConnectionsList.tsx
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

const ConnectionsList = () => {
  return (
    <List>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="provider" />
      </Datagrid>
    </List>
  );
};

export default ConnectionsList;
