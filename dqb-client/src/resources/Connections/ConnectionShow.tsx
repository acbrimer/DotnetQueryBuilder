
// src/resources/connections/ConnectionShow.tsx
import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
} from "react-admin";

const ConnectionShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField record source="id" />
      </SimpleShowLayout>
    </Show>
  );
};

export default ConnectionShow;


