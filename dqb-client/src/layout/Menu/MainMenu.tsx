// in src/MyMenu.js
import { Menu } from "react-admin";
import LabelIcon from "@mui/icons-material/Label";
import ConnectionsTreeView from "../../QueryTreeView/ConnectionsTreeView";

const MainMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.Item
      to="/custom-route"
      primaryText="Queries"
      leftIcon={<LabelIcon />}
    />
    <ConnectionsTreeView />
  </Menu>
);

export default MainMenu;
