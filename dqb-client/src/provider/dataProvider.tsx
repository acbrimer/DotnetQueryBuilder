import localStorageDataProvider from "ra-data-local-storage";
import defaultData from "./demoValues";

const dataProvider = localStorageDataProvider({
  defaultData: defaultData,
});

export default dataProvider;
