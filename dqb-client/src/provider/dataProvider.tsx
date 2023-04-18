import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils, withLifecycleCallbacks } from "ra-core";
import localStorageDataProvider from "ra-data-local-storage";
import demoValues from "./demoValues";
import { IConnectionCatalogRecord } from "../resources/ConnectionCatalogs";
import { IConnectionTableRecord } from "../resources/ConnectionTables";
import { IConnectionColumnRecord } from "../resources/ConnectionColumns";


const API_URI = "http://localhost:5006";

const baseDataProvider = simpleRestProvider(
  API_URI,
  fetchUtils.fetchJson,
  "X-Total-Count"
);

const _localDataProvider = localStorageDataProvider({
  defaultData: demoValues,
});

const localDataProvider = withLifecycleCallbacks(_localDataProvider, [
  {
    resource: "connections",
    beforeUpdate: async (params, dataProvider) => {
      try {
        await dataProvider.getOne("connections", {
          id: params.data.id,
        });
      } catch (e: any) {
        dataProvider.create("connections", {
          data: { id: params.data.id, createdTimestamp: Date.now() },
        });
      }
      return params;
    },
  },
  {
    resource: "connectionCatalogs",
    beforeUpdate: async (params, dataProvider) => {
      try {
        await dataProvider.getOne("connectionCatalogs", {
          id: params.data.id,
        });
      } catch (e: any) {
        dataProvider.create("connectionCatalogs", {
          data: { id: params.data.id, createdTimestamp: Date.now() },
        });
      }
      return params;
    },
  },
  {
    resource: "connectionTables",
    beforeUpdate: async (params, dataProvider) => {
      try {
        await dataProvider.getOne("connectionTables", {
          id: params.data.id,
        });
      } catch (e: any) {
        dataProvider.create("connectionTables", {
          data: { id: params.data.id, createdTimestamp: Date.now() },
        });
      }
      return params;
    },
  },
  {
    resource: "connectionColumns",
    beforeUpdate: async (params, dataProvider) => {
      try {
        await dataProvider.getOne("connectionColumns", {
          id: params.data.id,
        });
      } catch (e: any) {
        dataProvider.create("connectionColumns", {
          data: { id: params.data.id, createdTimestamp: Date.now() },
        });
      }
      return params;
    },
  },
]);

const providers: any = {
  base: baseDataProvider,
  local: localDataProvider,
};

const getResourceProvider = (resource: any) =>
  resource.includes("/")
    ? { provider: resource.split("/")[0], name: resource.split("/")[1] }
    : { provider: "base", name: resource };

const _dataProvider: any = {
  getList: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].getList(name, params);
  },
  getOne: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].getOne(name, params);
  },
  getMany: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].getMany(name, params);
  },
  getManyReference: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].getManyReference(name, params);
  },
  update: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].update(name, params);
  },
  updateMany: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].updateMany(name, params);
  },
  create: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].create(name, params);
  },
  delete: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].delete(name, params);
  },
  deleteMany: (resource: any, params: any) => {
    const { provider, name } = getResourceProvider(resource);
    return providers[provider].deleteMany(name, params);
  },
};

const dataProvider = withLifecycleCallbacks(_dataProvider, [
  {
    resource: "connection",
    afterCreate: async (params, dataProvider) => {
      await dataProvider.getOne("connectionSchema", params.data.id);
      return params;
    },
    afterDelete: async (params, dataProvider) => {
      console.log("deleted connection", params);
      return params;
    },
  },
  {
    resource: "connectionSchema",
    afterGetOne: async (params, dataProvider) => {
      await dataProvider.update("local/connections", {
        data: {
          id: params.data.id,
          name: params.data.id,
          provider: params.data.provider,
          catalog: params.data.database,
          lastSync: Date.now(),
        },
        id: params.data.id,
        previousData: {},
      });

      const catalogs: IConnectionCatalogRecord[] = (
        params.data as any
      ).catalogs.map(
        (c: any) =>
          ({
            id: c.id,
            catalog: c.catalog,
            connectionId: c.connectionId,
          } as IConnectionCatalogRecord)
      );
      // const tables: IConnectionTableRecord[] = (
      //   params.data as any
      // ).catalogs.flatMap((c: any) =>
      //   c.tables.map(
      //     (t: any) =>
      //       ({
      //         id: t.id,
      //         table: t.table,
      //         tableType: t.tableType,
      //         catalog: c.catalog,
      //         catalogId: c.id,
      //         connectionId: c.connectionId,
      //       } as IConnectionTableRecord)
      //   )
      // );

      // const columns: IConnectionColumnRecord[] = (
      //   params.data as any
      // ).catalogs.flatMap((c: any) =>
      //   c.tables.flatMap((t: any) =>
      //     t.columns.map(
      //       (col: any) =>
      //         ({
      //           ...col,
      //           id: col.id,
      //           column: col.column,
      //           table: col.table,
      //           tableId: t.id,
      //         } as IConnectionColumnRecord)
      //     )
      //   )
      // );

      catalogs.forEach(async (c) => {
        await dataProvider.update("local/connectionCatalogs", {
          data: c,
          id: c.id,
          previousData: {},
        });
      });
      // tables.forEach(async (c) => {
      //   await dataProvider.update("local/connectionTables", {
      //     data: c,
      //     id: c.id,
      //     previousData: {},
      //   });
      // });
      // columns.forEach(async (c) => {
      //   await dataProvider.update("local/connectionColumns", {
      //     data: c,
      //     id: c.id,
      //     previousData: {},
      //   });
      // });

      return params;
    },
  },
]);

// @ts-ignore
export default dataProvider;
