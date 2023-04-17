
// src/resources/connectioncolumns/ConnectionColumnCreate.tsx
import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  required,
} from "react-admin";

const ConnectionColumnCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="id" validate={[required()]} fullWidth />
      </SimpleForm>
    </Create>
  );
};

export default ConnectionColumnCreate;

