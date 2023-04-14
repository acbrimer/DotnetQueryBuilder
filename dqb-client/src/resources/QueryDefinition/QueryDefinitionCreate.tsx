import * as React from "react";
import { Create, SimpleForm, TextInput, ArrayInput } from "react-admin";
import QueryTreeView from "../../QueryTreeView/QueryTreeView";
import SelectExpressionInput from "./SelectExpressionInput";
import TreeBuilder from "./TreeBuilder";

const q1 = {
  columns: [
    {
      name: "id",
      table: "customers",
      _type: "column",
    },
    {
      name: "first_name",
      table: "customers",
      alias: "Customer First Name",
      _type: "column",
    },
    {
      name: "last_name",
      table: "customers",
      alias: "Customer Last Name",
      _type: "column",
    },
    {
      operator: "divide",
      left: {
        name: "weight",
        table: "customers",
        _type: "column",
      },
      right: {
        name: "height",
        table: "customers",
        _type: "column",
      },
      _type: "binary",
    },
  ],
  fromClause: {
    table: "customers",
    alias: "customers",
    _type: "table",
  },
  _type: "select",
};

const QueryDefinitionCreate = () => {
  return (
    <Create>
      <SimpleForm onSubmit={(data: any) => console.log("data", data)}>
        <SelectExpressionInput source="select" />
        <QueryTreeView node={q1 as IQueryExpression} />
      </SimpleForm>
    </Create>
  );
};

export default QueryDefinitionCreate;
