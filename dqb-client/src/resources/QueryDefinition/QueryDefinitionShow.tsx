import * as React from "react";
import { Show, SimpleShowLayout, TextField } from "react-admin";

const QueryDefinitionShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" />
      </SimpleShowLayout>
    </Show>
  );
};

export default QueryDefinitionShow;
