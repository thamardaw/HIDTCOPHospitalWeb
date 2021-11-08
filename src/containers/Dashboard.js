import { CssBaseline, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { Patient } from "./Patient";
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
          <Route path={`${path}/patient`} component={Patient} />
          <Redirect to={`${path}/patient`} />
        </Switch>
      </Box>
    </Box>
  );
}

export default Dashboard;
