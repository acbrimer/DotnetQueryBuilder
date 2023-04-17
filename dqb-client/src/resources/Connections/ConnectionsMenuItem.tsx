
// src/resources/connections/ConnectionsList.tsx
import * as React from "react";
import {
  ArrayField,
  BooleanField,
  ChipField,
  Datagrid,
  ListBase,
  NumberField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from "react-admin";

const ConnectionsMenuItem = () => {
  return (
    <ListBase>
      <Datagrid></Datagrid>
    </ListBase>
  );
};

export default ConnectionsMenuItem;

