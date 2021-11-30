import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  Toolbar,
} from "@mui/material";
import { Box } from "@mui/system";
import PeopleIcon from "@mui/icons-material/People";
import React from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";

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
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem>
          <Button
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
        <ListItem>
          <Button
            variant={location.pathname.includes("/uom") ? "contained" : "text"}
            fullWidth
            startIcon={<PeopleIcon />}
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
