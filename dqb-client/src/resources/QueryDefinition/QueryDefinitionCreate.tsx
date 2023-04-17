import * as React from "react";
import {
  Create,
  TabbedForm,
  FormTab,
  SimpleForm,
  TextInput,
  ArrayInput,
} from "react-admin";
import { useWatch } from "react-hook-form";
import QueryTreeView from "../../QueryTreeView/QueryTreeView";
import QueryExpression from "../../QueryExpression/QueryExpression";
import { ex1, ex2 } from "./exampleQueries";

const QuerySQLPreview = () => {
  const baseQuery = useWatch({ name: "baseQuery" });
  const [sql, setSql] = React.useState<string>("");

  React.useEffect(() => {
    const qe = new QueryExpression(baseQuery);
    setSql(qe.ToSql());
  });
  return (
    <div>
      <p style={{ whiteSpace: "break-spaces" }}>{sql}</p>
    </div>
  );
};

const QueryJSONPreview = () => {
  const baseQuery = useWatch({ name: "baseQuery" });

  return (
    <div>
      <p style={{ whiteSpace: "break-spaces" }}>
        {JSON.stringify(baseQuery, null, 2)}
      </p>
    </div>
  );
};

const QueryDefinitionCreate = () => {
  return (
    <Create>
      <TabbedForm
        defaultValues={{ baseQuery: ex2 }}
        onSubmit={(data: any) => console.log("data", data)}
      >
        <FormTab label="Tree">
          <QueryTreeView source="baseQuery" />
        </FormTab>
        <FormTab label="SQL">
          <QuerySQLPreview />
        </FormTab>
        <FormTab label="JSON">
          <QueryJSONPreview />
        </FormTab>
      </TabbedForm>
    </Create>
  );
};

export default QueryDefinitionCreate;
