
// src/resources/connectioncolumns/ConnectionColumnShow.tsx
import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
} from "react-admin";

const ConnectionColumnShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
      </SimpleShowLayout>
    </Show>
  );
};

export default ConnectionColumnShow;


