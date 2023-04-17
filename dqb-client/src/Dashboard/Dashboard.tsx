// in src/dashboard/Dashboard.tsx
import { Card, CardContent, CardHeader } from "@mui/material";
import ConnectionsTreeView from "../QueryTreeView/ConnectionsTreeView";
import SqlInput from "../QueryTreeView/SqlInput";

const Dashboard = () => (
  <Card>
    <CardHeader title="Dashboard" />
    <CardContent>
      <ConnectionsTreeView />
    </CardContent>
  </Card>
);

export default Dashboard;
