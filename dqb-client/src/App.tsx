import * as React from "react";
import { Admin, Resource } from "react-admin";
import queryDefinition from "./resources/QueryDefinition";
import Dashboard from "./Dashboard";
import dataProvider from "./provider/dataProvider";
import Connections from "./resources/Connections";

const App = () => (
  <Admin dashboard={Dashboard} dataProvider={dataProvider}>
    <Resource name="queryDefinition" {...queryDefinition} />
    <Resource name="connections" {...Connections} />
    <Resource name="connectionCatalogs" />
    <Resource name="connectionTables" />
    <Resource name="connectionColumns" />
  </Admin>
);

export default App;
