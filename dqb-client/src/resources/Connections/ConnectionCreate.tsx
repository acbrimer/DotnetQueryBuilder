// src/resources/connections/ConnectionCreate.tsx
import * as React from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  required,
  SelectInput,
} from "react-admin";

const ConnectionCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <SelectInput
          choices={[
            { id: "postgres", name: "Postgres" },
            { id: "sqlite", name: "Sqlite" },
          ]}
          source="provider"
          validate={[required()]}
        />
        <TextInput source="host" validate={[required()]} />
        <TextInput source="database" />
        <TextInput source="username" />
        <TextInput source="password" />
      </SimpleForm>
    </Create>
  );
};

export default ConnectionCreate;
