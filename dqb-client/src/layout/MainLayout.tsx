import { Layout, LayoutProps } from "react-admin";

import MainMenu from "./Menu/MainMenu";

const MainLayout = (props: LayoutProps) => (
  <Layout {...props} menu={MainMenu} />
);

export default MainLayout;
