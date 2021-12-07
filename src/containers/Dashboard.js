import { CssBaseline, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { Patient } from "./Patient";
import { Appbar, Footer, ResponsiveDrawer } from "../components";
import { Uom } from "./Billing/Uom";
import { Category } from "./Billing/Category";
import { SalesServiceItem } from "./Billing/SalesServiceItem";

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
          <Route path={`${path}/uom`} component={Uom} />
          <Route path={`${path}/category`} component={Category} />
          <Route
            path={`${path}/salesServiceItem`}
            component={SalesServiceItem}
          />
          <Redirect to={`${path}/patient`} />
        </Switch>
        <Footer />
      </Box>
    </Box>
  );
}

export default Dashboard;
