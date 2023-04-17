import * as React from "react";
import { Admin, Resource } from "react-admin";
import localStorageDataProvider from "ra-data-local-storage";
import queryDefinition from "./resources/QueryDefinition";
import Dashboard from "./Dashboard";

const dataProvider = localStorageDataProvider();

const App = () => (
  <Admin dashboard={Dashboard} dataProvider={dataProvider}>
    <Resource name="queryDefinition" {...queryDefinition} />
  </Admin>
);

export default App;
