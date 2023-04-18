import * as React from "react";
import { Admin, Resource } from "react-admin";
import queryDefinition from "./resources/QueryDefinition";
import Dashboard from "./Dashboard";
import dataProvider from "./provider/dataProvider";
import Connections from "./resources/Connections";
import MainLayout from "./layout/MainLayout";

const App = () => (
  <Admin layout={MainLayout} dashboard={Dashboard} dataProvider={dataProvider}>
    
    <Resource name="local/queryDefinition" {...queryDefinition} />
    <Resource name="local/connections" {...Connections} />
    <Resource name="connections" {...Connections} />
    <Resource name="connectionSchema"  />
    <Resource name="local/connectionCatalogs" />
    <Resource name="local/connectionTables" />
    <Resource name="local/connectionColumns" />
    <Resource name="local/testSync" />
  </Admin>
);

export default App;
