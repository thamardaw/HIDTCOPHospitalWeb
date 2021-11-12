import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Logout } from "@mui/icons-material";
import React, { useContext } from "react";
import { AuthContext } from "../contexts";

const Appbar = ({ drawerWidth, handleDrawerToggle }) => {
  let { logoutUser } = useContext(AuthContext);
  return (
    <AppBar
      position="fixed"
      sx={{
        // width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          HIDTCOP
        </Typography>
        <IconButton sx={{ color: "white" }} onClick={() => logoutUser()}>
          <Logout />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Appbar);
