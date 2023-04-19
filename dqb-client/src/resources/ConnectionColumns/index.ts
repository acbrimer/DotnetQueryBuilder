// src/resources/connectioncolumns/index.ts
import ConnectionColumnCreate from "./ConnectionColumnCreate";
import ConnectionColumnsList from "./ConnectionColumnsList";
import ConnectionColumnEdit from "./ConnectionColumnEdit";
import ConnectionColumnShow from "./ConnectionColumnShow";
import { RaRecord } from "react-admin";

export interface IConnectionColumnRecord extends RaRecord {
  schema?: string;
  catalog?: string | null;
  table: string;
  tableId: string;
  tableAlias?: string;
  column: string;
  name?: string;
  columnAlias?: string;
  description?: string | null;
  nativeType?: string | null;
  dotnetType?: string | null;
  ordinalPosition?: number | null;
  hasDefault?: boolean | null;
  columnDefault?: string | null;
  characherMaximumLength?: number | null;
  numericPrecision?: number | null;
  numericScale?: number | null;
  dateTimePrecision?: number | null;
  isPrimaryKey?: boolean | null;
  isForeignKey?: boolean | null;
  foreignKeyName?: string | null;
  foreignKeySequence: number | null;
  foreignKeyReferenceCatalog: string | null;
  foreignKeyReferenceSchema: string | null;
  foreignKeyReferenceTable: string | null;
  foreignKeyReferenceColumn: string | null;
  isNullable: boolean | null;
  isAutoIncrementable: boolean | null;
  isUnique: boolean | null;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: ConnectionColumnsList,
  create: ConnectionColumnCreate,
  edit: ConnectionColumnEdit,
  show: ConnectionColumnShow,
};
