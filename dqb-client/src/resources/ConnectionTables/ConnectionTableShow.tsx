
// src/resources/connectiontables/ConnectionTableShow.tsx
import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
} from "react-admin";

const ConnectionTableShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
      </SimpleShowLayout>
    </Show>
  );
};

export default ConnectionTableShow;


