
// src/resources/connectiontables/ConnectionTableEdit.tsx
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

const ConnectionTableEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="id" />
      </SimpleForm>
    </Edit>
  );
};

export default ConnectionTableEdit;

