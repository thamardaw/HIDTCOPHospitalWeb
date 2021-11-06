import { CssBaseline, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router";
import {
  PatientEdit,
  PatientCreate,
  PatientTable,
  PatientDetail,
} from "./Patient";
import { Appbar, ResponsiveDrawer } from "../components";

const drawerWidth = 240;

function Dashboard(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { path } = useRouteMatch();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Appbar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <ResponsiveDrawer
        drawerWidth={drawerWidth}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 1,
          width: "100%",
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Switch>
          <Route path={`${path}`} component={PatientTable} exact />
          <Route path={`${path}/create`} component={PatientCreate} />
          <Route path={`${path}/edit`} component={PatientEdit} />
          <Route path={`${path}/detail`} component={PatientDetail} />
        </Switch>
      </Box>
    </Box>
  );
}

export default Dashboard;
