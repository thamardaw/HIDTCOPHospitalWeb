import {
  Button,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  Toolbar,
} from "@mui/material";
import { Box } from "@mui/system";
import PeopleIcon from "@mui/icons-material/People";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import CategoryIcon from "@mui/icons-material/Category";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import React from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

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
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem>
          <Button
            size="small"
            variant={
              location.pathname.includes("/patient") ? "contained" : "text"
            }
            fullWidth
            startIcon={<PeopleIcon />}
            onClick={() => history.push(`${url}/patients`)}
            sx={{
              display: "flex",
              justifyContent: location.pathname.includes("/patient")
                ? "flex-end"
                : "flex-start",
            }}
          >
            Patient
          </Button>
        </ListItem>
        <ListItem onClick={handleClick}>
          <Button
            size="small"
            variant={
              location.pathname.includes("/salesServiceItem") ||
              location.pathname.includes("/uom") ||
              location.pathname.includes("/category") ||
              location.pathname.includes("/bills") ||
              location.pathname.includes("/payment")
                ? "contained"
                : "text"
            }
            fullWidth
            startIcon={<CreditCardIcon />}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            Billing
            {open ? <ExpandLess /> : <ExpandMore />}
          </Button>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem>
              <Button
                size="small"
                variant={
                  location.pathname.includes("/uom") ? "contained" : "text"
                }
                fullWidth
                startIcon={<SquareFootIcon />}
                onClick={() => history.push(`${url}/uom`)}
                sx={{
                  display: "flex",
                  justifyContent: location.pathname.includes("/uom")
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                UOM
              </Button>
            </ListItem>
            <ListItem>
              <Button
                size="small"
                variant={
                  location.pathname.includes("/category") ? "contained" : "text"
                }
                fullWidth
                startIcon={<CategoryIcon />}
                onClick={() => history.push(`${url}/category`)}
                sx={{
                  display: "flex",
                  justifyContent: location.pathname.includes("/category")
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                Category
              </Button>
            </ListItem>
            <ListItem>
              <Button
                size="small"
                variant={
                  location.pathname.includes("/salesServiceItem")
                    ? "contained"
                    : "text"
                }
                fullWidth
                startIcon={<EventNoteIcon />}
                onClick={() => history.push(`${url}/salesServiceItem`)}
                sx={{
                  display: "flex",
                  justifyContent: location.pathname.includes(
                    "/salesServiceItem"
                  )
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                Sales & Service Item
              </Button>
            </ListItem>
            <ListItem>
              <Button
                size="small"
                variant={
                  location.pathname.includes("/bills") ? "contained" : "text"
                }
                fullWidth
                startIcon={<ReceiptIcon />}
                onClick={() => history.push(`${url}/bills`)}
                sx={{
                  display: "flex",
                  justifyContent: location.pathname.includes("/bills")
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                Bills
              </Button>
            </ListItem>
            <ListItem>
              <Button
                size="small"
                variant={
                  location.pathname.includes("/payment") ? "contained" : "text"
                }
                fullWidth
                startIcon={<AttachMoneyIcon />}
                onClick={() => history.push(`${url}/payment`)}
                sx={{
                  display: "flex",
                  justifyContent: location.pathname.includes("/payment")
                    ? "flex-end"
                    : "flex-start",
                }}
              >
                Payment
              </Button>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
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
