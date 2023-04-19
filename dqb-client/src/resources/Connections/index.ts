// src/resources/connections/index.ts
import ConnectionCreate from "./ConnectionCreate";
import ConnectionsList from "./ConnectionsList";
import ConnectionEdit from "./ConnectionEdit";
import ConnectionShow from "./ConnectionShow";
// Menu item
import ConnectionsMenuItem from "./ConnectionsMenuItem";
import { RaRecord } from "react-admin";
import { IConnectionCatalogRecord } from "../ConnectionCatalogs";

export interface IConnectionRecord extends RaRecord {
  // the name of the connection
  name: string;
  // the type of database for the connection
  provider: "astro" | "postgres" | "sqlite" | "mysql" | "mssql";
  // default db to connect to
  catalog?: string;

  catalogs: IConnectionCatalogRecord[];
}

export { ConnectionsMenuItem };
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: ConnectionsList,
  create: ConnectionCreate,
  edit: ConnectionEdit,
  show: ConnectionShow,
};
