import { IConnectionCatalogRecord } from "../resources/ConnectionCatalogs";
import { IConnectionColumnRecord } from "../resources/ConnectionColumns";
import { IConnectionRecord } from "../resources/Connections";
import { IConnectionTableRecord } from "../resources/ConnectionTables";

const connections: IConnectionRecord[] = [
  {
    id: "connection1",
    name: "First Test Connection",
    provider: "postgres",
  },
  {
    id: "connection2",
    name: "Second Test Connection",
    provider: "sqlite",
  },
];

const catalogs: IConnectionCatalogRecord[] = [
  {
    id: "connection1.ordersDb",
    catalog: "ordersDb",
    connectionId: "connection1",
  },
  {
    id: "connection2.ordersDb",
    catalog: "ordersDb",
    connectionId: "connection2",
  },
];

const tables: IConnectionTableRecord[] = [
  {
    id: "connection1.ordersDb.public.customers",
    table: "customers",
    schema: "public",
    catalog: "ordersDb",
    connectionId: "connection1",
    catalogId: "connection1.ordersDb",
  },
  {
    id: "connection1.ordersDb.public.orders",
    table: "orders",
    schema: "public",
    catalog: "ordersDb",
    connectionId: "connection1",
    catalogId: "connection1.ordersDb",
  },
  {
    id: "connection2.ordersDb.customers",
    table: "customers",
    connectionId: "connection2",
    catalogId: "connection2.ordersDb",
  },
  {
    id: "connection2.ordersDb.orders",
    table: "orders",
    connectionId: "connection2",
    catalogId: "connection2.ordersDb",
  },
];

const buildColumns = [
  {
    column: "id",
    commonType: "integer",
    table: "customers",
  },
  {
    column: "first_name",
    table: "customers",
  },
  {
    column: "last_name",
    table: "customers",
  },
  {
    column: "email",
    table: "customers",
  },
  {
    column: "phone",
    table: "customers",
  },
  {
    column: "id",
    table: "orders",
  },
  {
    column: "customer_id",
    table: "orders",
  },
  {
    column: "items_ordered",
    table: "orders",
  },
  {
    column: "order_total",
    table: "orders",
  },
  {
    column: "order_tax",
    table: "orders",
  },
  {
    column: "order_shipping",
    table: "orders",
  },
];

const columns: IConnectionColumnRecord[] = tables.flatMap((t) =>
  buildColumns
    .filter((c: any) => c.table === t.table)
    .map(
      (c: any) =>
        ({
          ...c,
          id: `${t.id}.${c.column}`,
          tableId: t.id,
        } as IConnectionColumnRecord)
    )
);
// eslint-disable-next-line import/no-anonymous-default-export
export default {
  connections: connections,
  connectionCatalogs: catalogs,
  connectionTables: tables,
  connectionColumns: columns,
  testSync: [],
};
