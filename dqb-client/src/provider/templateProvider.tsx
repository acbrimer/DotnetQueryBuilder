import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils, withLifecycleCallbacks } from "ra-core";
import localStorageDataProvider from "ra-data-local-storage";

// const API_URL =
//   process.env.NODE_ENV === "production"
//     ? "https://ok-election-api-2dv2egospq-uc.a.run.app"
//     : "http://localhost:8080";

const API_URI = "http://localhost:5006";

const _baseDataProvider = simpleRestProvider(
  API_URI,
  fetchUtils.fetchJson,
  "X-Total-Count"
);

const baseDataProvider = withLifecycleCallbacks(_baseDataProvider, [
  {
    resource: "connection",
    afterCreate: async (params, dataProvider) => {
      console.log("connection created!", params);
      await dataProvider.getOne("connectionSchema", params.data.id);
      return params;
    },
  },
  {
    resource: "connectionSchema",
    afterGetOne: async (params, dataProvider) => {
      console.log("connectionSchema afterGetOne", params.data);
      await dataProvider.delete("local/testSync", params.data.id);
      await dataProvider.create("local/testSync", {
        data: {
          id: params.data.id,
          lastSync: Date.now(),
        },
      });
      return params;
    },
  },
]);

const _localDataProvider = localStorageDataProvider();

const localDataProvider = withLifecycleCallbacks(_localDataProvider, [
  {
    resource: "testSync",
    afterCreate: async (params, dataProvider) => {
      console.log("created testSync resource!", params);
      //   // delete all comments related to the post
      //   // first, fetch the comments
      //   try {
      //     const { data } = await dataProvider.getOne("concepts", {
      //       id: params.id,
      //     });
      //   } catch {
      //     await dataProvider.create("concepts", {
      //       data: {
      //         id: parseInt(params.id),
      //         firstViewedTimestamp: Date.now(),
      //         ancestorFilters: {
      //           minLevelsOfSeparation: 1,
      //         },
      //         descendantFilters: {
      //           minLevelsOfSeparation: 1,
      //         },
      //       },
      //     });
      //   }
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

const dataProvider: any = {
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

// @ts-ignore
export default dataProvider;
