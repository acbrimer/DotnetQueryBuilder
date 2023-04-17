
// src/resources/connectioncolumns/ConnectionColumnEdit.tsx
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

const ConnectionColumnEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" />
      </SimpleForm>
    </Edit>
  );
};

export default ConnectionColumnEdit;

