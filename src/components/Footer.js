import { Toolbar, Typography } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Toolbar variant="dense">
      <Typography
        variant="caption"
        noWrap
        component="div"
        sx={{ flexGrow: 1 }}
        textAlign="center"
      >
        HIDTCOP - Developed By Magix Support © 2021
      </Typography>
    </Toolbar>
  );
};

export default React.memo(Footer);
