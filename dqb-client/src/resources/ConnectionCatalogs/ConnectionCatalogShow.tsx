
// src/resources/connectioncatalogs/ConnectionCatalogShow.tsx
import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
} from "react-admin";

const ConnectionCatalogShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
      </SimpleShowLayout>
    </Show>
  );
};

export default ConnectionCatalogShow;


