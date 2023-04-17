
// src/resources/connections/ConnectionEdit.tsx
import * as React from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  required,
} from "react-admin";

const ConnectionEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" />
      </SimpleForm>
    </Edit>
  );
};

export default ConnectionEdit;

