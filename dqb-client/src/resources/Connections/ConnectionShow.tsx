// src/resources/connections/ConnectionShow.tsx
import * as React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  RichTextField,
  useGetOne,
  useGetRecordId,
  LoadingIndicator,
} from "react-admin";

const ConnectionShow = () => {
  const id = useGetRecordId();
  const { data, isLoading, isError } = useGetOne("connectionSchema", {
    id: id,
  });
  if (isLoading) return <LoadingIndicator />;
  if (isError) return <div>Error!</div>;
  return (
    <Show>
      <SimpleShowLayout>
        <TextField record source="id" />
        <div
          style={{
            whiteSpace: "break-spaces",
            width: "fit-content",
            minHeight: "300px",
            minWidth: "300px",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </div>
      </SimpleShowLayout>
    </Show>
  );
};

export default ConnectionShow;
