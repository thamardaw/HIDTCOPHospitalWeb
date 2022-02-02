import React, { createContext, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

const SnackbarContext = createContext();

export default SnackbarContext;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const SnackbarProvider = ({ children }) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState({
    status: "",
    detail: "",
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
    setMessage({ status: message.status, detail: "" });
  };

  let contextData = {
    openAlert: setOpenAlert,
    message: setMessage,
  };

  return (
    <SnackbarContext.Provider value={contextData}>
      {children}
      <Snackbar
        open={openAlert}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={message.status === 200 ? "success" : "error"}>
          {message.detail}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
