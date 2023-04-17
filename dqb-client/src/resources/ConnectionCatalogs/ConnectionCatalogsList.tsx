
// src/resources/connectioncatalogs/ConnectionCatalogsList.tsx
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

const ConnectionCatalogsList = () => {
  return (
    <List>
      <Datagrid></Datagrid>
    </List>
  );
};

export default ConnectionCatalogsList;

