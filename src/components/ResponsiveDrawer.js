import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import PeopleIcon from "@mui/icons-material/People";

const ResponsiveDrawer = (props) => {
  const { window, drawerWidth, mobileOpen, handleDrawerToggle } = props;
  const container =
    window !== undefined ? () => window().document.body : undefined;
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem onClick={() => console.log("here")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText>
            <Typography>Patient</Typography>
          </ListItemText>
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

export default ResponsiveDrawer;
