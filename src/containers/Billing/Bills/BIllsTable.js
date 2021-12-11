import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tab,
  Tabs,
} from "@mui/material";
import { Box } from "@mui/material";
import { useState } from "react";
import { CustomTable, TabPanel } from "../../../components";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "Bill ID",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Patient Name",
  },
  {
    id: "phone",
    numeric: false,
    disablePadding: false,
    label: "Patient Phone",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Patient Address",
  },
  {
    id: "totalAmount",
    numeric: false,
    disablePadding: false,
    label: "Total Amount",
  },
];

const BillsTable = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const handleClickOpen = (id) => {
    setId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteItem = async () => {};

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Drafted" />
        <Tab label="Printed" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <CustomTable
          tableName="Drafted Bills"
          headCells={headCells}
          rows={rows}
          onDelete={handleClickOpen}
          addDelete={false}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <CustomTable
          tableName="Printed Bills"
          headCells={headCells}
          rows={rows}
          onDelete={handleClickOpen}
          addDelete={false}
        />
      </TabPanel>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteItem} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillsTable;
