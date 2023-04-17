// src/resources/connectioncatalogs/index.ts
import ConnectionCatalogCreate from "./ConnectionCatalogCreate";
import ConnectionCatalogsList from "./ConnectionCatalogsList";
import ConnectionCatalogEdit from "./ConnectionCatalogEdit";
import ConnectionCatalogShow from "./ConnectionCatalogShow";
import { RaRecord } from "react-admin";

export interface IConnectionCatalogRecord extends RaRecord {
  // the name of the catalog
  catalog: string;
  // the connectionId for the catalog
  connectionId: string;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: ConnectionCatalogsList,
  create: ConnectionCatalogCreate,
  edit: ConnectionCatalogEdit,
  show: ConnectionCatalogShow,
};
