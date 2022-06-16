import {
  Button,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  Toolbar,
  ListSubheader
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
import React, { useContext, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { CacheContext } from "../contexts";

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
  const [open, setOpen] = useState(true);
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

  const openAccordionList = () => {
    setOpen(!open);
  };

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <List 
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            M E N U
          </ListSubheader>
        }
      >
        <Button
          fullWidth
          onClick={openAccordionList}
        >
          <ListItemIcon>
            <CreditCardIcon/>
          </ListItemIcon>
          <ListItemText primary="Billing" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </Button>
        
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding >
            <ListItem>
              <Button
                sx={{ pl: 4 }}
                onClick={handleClick(`${url}/bills`)}
                fullWidth
              >
                <ListItemIcon>
                  <ReceiptIcon/>
                </ListItemIcon>
                <ListItemText primary="Bills" />
              </Button>
            </ListItem>
            <ListItem>
              <Button
                
                onClick={handleClick(`${url}/deposit`)}
                fullWidth
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                    <AccountBalanceIcon/>
                </ListItemIcon>
                <ListItemText primary="Deposit" />
              </Button>
            </ListItem>
            <ListItem>
              <Button
                
                onClick={handleClick(`${url}/dailyClosing`)}
                fullWidth
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <AnalyticsIcon/>
                </ListItemIcon>
                <ListItemText primary="Daily Closing" />
              </Button>
            </ListItem>
            <ListItem>
              <Button
                onClick={handleClick(`${url}/uom`)}
                fullWidth
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <SquareFootIcon/>
                </ListItemIcon>
                <ListItemText primary="UOM" />
              </Button>
            </ListItem>
            <ListItem>
              <Button
                onClick={handleClick(`${url}/category`)}
                fullWidth
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <CategoryIcon/>
                </ListItemIcon>
                <ListItemText primary="Category" />
              </Button>
            </ListItem>
            <ListItem>
              <Button
                onClick={handleClick(`${url}/salesServiceItem`)}
                fullWidth
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <EventNoteIcon/>
                </ListItemIcon>
                <ListItemText primary="Sales & Service Item" />
              </Button>
            </ListItem>
          </List>
        </Collapse>
        <ListItem>
          <Button
            onClick={handleClick(`${url}/patient`)}
            fullWidth
          >
            <ListItemIcon>
              <PeopleIcon/>
            </ListItemIcon>
            <ListItemText primary="Patient"/>
          </Button>
        </ListItem>
      </List>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
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