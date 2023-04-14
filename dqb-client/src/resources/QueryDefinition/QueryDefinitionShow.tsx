import * as React from "react";
import { Create, SimpleForm, TextInput, ArrayInput } from "react-admin";
import SelectExpressionInput from "./SelectExpressionInput";

const QueryDefinitionShow = () => {
  return (
    <Create>
      <SimpleForm>
        <SelectExpressionInput source="select" />
      </SimpleForm>
    </Create>
  );
};

export default QueryDefinitionShow;
