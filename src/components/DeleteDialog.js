import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function DeleteDialog({
  isOpen,
  handleClose,
  callback,
  title = "Are you sure?",
  content = "You are about to permanently delete it and will never be able to see it again.",
}) {
  return (
    <Dialog fullWidth={true} maxWidth="xs" open={isOpen} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: "center" }}>{title}</DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          disableElevation
          variant="outlined"
          sx={{ width: "40%" }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          disableElevation
          variant="contained"
          color="error"
          sx={{ width: "40%" }}
          onClick={callback}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteDialog;
