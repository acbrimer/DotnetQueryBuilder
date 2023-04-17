
// src/resources/connectiontables/index.ts
import ConnectionTableCreate from "./ConnectionTableCreate";
import ConnectionTablesList from "./ConnectionTablesList";
import ConnectionTableEdit from "./ConnectionTableEdit";
import ConnectionTableShow from "./ConnectionTableShow";
import { RaRecord } from "react-admin";

export interface IConnectionTableRecord extends RaRecord {
  table: string;
  schema?: string;
  catalog?: string;
  connectionId: string;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: ConnectionTablesList,
  create: ConnectionTableCreate,
  edit: ConnectionTableEdit,
  show: ConnectionTableShow,
};

