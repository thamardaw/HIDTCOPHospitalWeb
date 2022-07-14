import React from "react";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { useRecoilState } from "recoil";
import { withAlert } from "../recoil/snackbar";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const CustomSnackbar = ({ children }) => {
  const [snackbar, setSnackbar] = useRecoilState(withAlert);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, isOpen: false });
  };

  return (
    <>
      {children}
      <Snackbar
        open={snackbar.isOpen}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.status === 200 ? "success" : "error"}>
          {snackbar.detail}
        </Alert>
      </Snackbar>
    </>
  );
};
