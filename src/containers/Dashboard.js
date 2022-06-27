import { CssBaseline, Toolbar } from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router";
import { Patient } from "./Patient";
import { Appbar, Footer, ResponsiveDrawer } from "../components";
import { Uom } from "./Billing/Uom";
import { Category } from "./Billing/Category";
import { SalesServiceItem } from "./Billing/SalesServiceItem";
import { Bills } from "./Billing/Bills";
import { Deposit } from "./Billing/Deposit";
import { DailyClosing } from "./Billing/DailyClosing";
import { InventoryItem } from "./Inventory/InventoryItem";
import { LoadingProvider } from "../contexts/LoadingContext";
import { CacheProvider } from "../contexts/CacheContext";
import { InventoryTransaction } from "./Inventory/InventoryTransaction";
import { PharmacyItem } from "./Inventory/PharmacyItem";
import { TransactionType } from "./Inventory/TransactionType";

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
      <CacheProvider>
        <ResponsiveDrawer
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          <Toolbar />
          <LoadingProvider>
            <Switch>
              <Route path={`${path}/patient`} component={Patient} />
              <Route path={`${path}/uom`} component={Uom} />
              <Route path={`${path}/category`} component={Category} />
              <Route
                path={`${path}/salesServiceItem`}
                component={SalesServiceItem}
              />
              <Route path={`${path}/bills`} component={Bills} />
              <Route path={`${path}/deposit`} component={Deposit} />
              <Route path={`${path}/dailyClosing`} component={DailyClosing} />
              <Route
                path={`${path}/inventory_item`}
                component={InventoryItem}
              />
              <Route
                path={`${path}/inventory_transaction`}
                component={InventoryTransaction}
              />
              <Route path={`${path}/pharmacy_item`} component={PharmacyItem} />
              <Route
                path={`${path}/transaction_type`}
                component={TransactionType}
              />
              <Redirect to={`${path}/patient`} />
            </Switch>
          </LoadingProvider>
          <Footer />
        </Box>
      </CacheProvider>
    </Box>
  );
}

export default Dashboard;
