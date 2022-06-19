import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Drawer,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import PeopleIcon from "@mui/icons-material/People";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import CategoryIcon from "@mui/icons-material/Category";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ReceiptIcon from "@mui/icons-material/Receipt";
import InventoryIcon from "@mui/icons-material/Inventory";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import React, { useContext, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { CacheContext } from "../contexts";
import ClassIcon from "@mui/icons-material/Class";

const ResponsiveDrawer = ({
  window,
  drawerWidth,
  mobileOpen,
  handleDrawerToggle,
}) => {
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const location = useLocation();
  const history = useHistory();
  const { url } = useRouteMatch();
  const [openBilling, setBillingOpen] = useState(true);
  const [openInventory, setOpenInventory] = useState(true);
  const { table, viewTab } = useContext(CacheContext);
  const { resetTable } = table;
  const { resetTab } = viewTab;

  const handleClick = (path) => {
    return (e) => {
      if (location.pathname !== path) {
        resetTable();
        resetTab();
      }
      history.push(path);
    };
  };

  const openBillingAccordionList = () => {
    setBillingOpen(!openBilling);
  };

  const openInventroyAccordionList = () => {
    setOpenInventory(!openInventory);
  };

  const drawer = (
    <>
      <Toolbar />
      <List
        component="nav"
        aria-label="Main Menu"
        style={{ fontSize: "small" }}
      >
        <ListItem>
          <Typography variant="overline" display="block">
            Menu
          </Typography>
        </ListItem>
        <ListItemButton
          selected={
            location.pathname.includes("bills") ||
            location.pathname.includes("deposit") ||
            location.pathname.includes("dailyClosing") ||
            location.pathname.includes("uom") ||
            location.pathname.includes("category") ||
            location.pathname.includes("salesServiceItem")
          }
          onClick={openAccordionList}
        >
          <ListItemIcon>
            <CreditCardIcon />
          </ListItemIcon>
          <ListItemText primary="Billing" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              size="small"
              sx={{ pl: "25px" }}
              selected={location.pathname.includes("bills")}
              onClick={handleClick(`${url}/bills`)}
            >
              <ListItemIcon>
                <ReceiptIcon />
              </ListItemIcon>
              <ListItemText primary="Bills" />
            </ListItemButton>

            <ListItemButton
              size="small"
              sx={{ pl: "25px" }}
              selected={location.pathname.includes("deposit")}
              onClick={handleClick(`${url}/deposit`)}
            >
              <ListItemIcon>
                <AccountBalanceIcon />
              </ListItemIcon>
              <ListItemText primary="Deposit" />
            </ListItemButton>

            <ListItemButton
              size="small"
              sx={{ pl: "25px" }}
              selected={location.pathname.includes("dailyClosing")}
              onClick={handleClick(`${url}/dailyClosing`)}
            >
              <ListItemIcon>
                <AnalyticsIcon />
              </ListItemIcon>
              <ListItemText primary="Daily Closing" />
            </ListItemButton>

            <ListItemButton
              size="small"
              sx={{ pl: "25px" }}
              selected={location.pathname.includes("uom")}
              onClick={handleClick(`${url}/uom`)}
            >
              <ListItemIcon>
                <SquareFootIcon />
              </ListItemIcon>
              <ListItemText primary="UOM" />
            </ListItemButton>

            <ListItemButton
              size="small"
              sx={{ pl: "25px" }}
              selected={location.pathname.includes("category")}
              onClick={handleClick(`${url}/category`)}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Category" />
            </ListItemButton>

            <ListItemButton
              size="small"
              sx={{ pl: "25px" }}
              selected={location.pathname.includes("salesServiceItem")}
              onClick={handleClick(`${url}/salesServiceItem`)}
            >
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Sales & Service Item" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton
          size="small"
          selected={location.pathname.includes("patient")}
          onClick={handleClick(`${url}/patient`)}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Patient" />
        </ListItemButton>
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
    >
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default React.memo(ResponsiveDrawer);
