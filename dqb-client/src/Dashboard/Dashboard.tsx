// in src/dashboard/Dashboard.tsx
import { Card, CardContent, CardHeader } from "@mui/material";
import SqlInput from "../QueryTreeView/SqlInput";

const Dashboard = () => (
  <Card>
    <CardHeader title="Dashboard" />
    <CardContent>
      <SqlInput />
    </CardContent>
  </Card>
);

export default Dashboard;
