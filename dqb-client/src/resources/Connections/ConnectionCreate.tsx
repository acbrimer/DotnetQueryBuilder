
// src/resources/connections/ConnectionCreate.tsx
import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  required,
} from "react-admin";

const ConnectionCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="id" validate={[required()]} fullWidth />
      </SimpleForm>
    </Create>
  );
};

export default ConnectionCreate;

