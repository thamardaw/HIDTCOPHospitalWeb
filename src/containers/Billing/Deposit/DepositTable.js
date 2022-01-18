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
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { CustomTable, TabPanel } from "../../../components";
import { useAxios } from "../../../hooks";
import { generateID } from "../../../utils/generateID";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "patient_id",
    numeric: false,
    disablePadding: false,
    label: "Patient ID",
  },
  {
    id: "patient_name",
    numeric: false,
    disablePadding: false,
    label: "Patient Name",
  },
  {
    id: "amount",
    numeric: false,
    disablePadding: false,
    label: "Amount",
  },
];
const DepositTable = () => {
  const api = useAxios();
  const [activeRows, setActiveRows] = useState([]);
  const [usedRows, setUsedRows] = useState([]);
  const [open, setOpen] = useState(false);
  //   const [id, setId] = useState("");
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const handleClickOpen = (id) => {
    // setId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getActiveDeposit = useCallback(async () => {
    const res = await api.get("/api/deposit/active");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          patient_name: row.patient.name,
          patient_id: generateID(row.patient_id, row.patient.created_time),
          amount: row.amount.toString(),
        };
      });
      setActiveRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const getUsedDeposit = useCallback(async () => {
    const res = await api.get("/api/deposit/used");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id.toString(),
          patient_name: row.patient.name,
          patient_id: generateID(row.patient_id, row.patient.created_time),
          amount: row.amount.toString(),
        };
      });
      setUsedRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const deleteItem = async () => {
    // await api.delete(`/api/deposit/${parseInt(id.split("-")[1])}`);
    // handleClose();
    // getActiveDeposit();
  };

  useEffect(() => {
    getActiveDeposit();
    getUsedDeposit();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Active" />
        <Tab label="Used" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <CustomTable
          tableName="Deposit"
          headCells={headCells}
          rows={activeRows}
          onDelete={handleClickOpen}
          addDelete={false}
          addEdit={false}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <CustomTable
          tableName="Deposit"
          headCells={headCells}
          rows={usedRows}
          onDelete={handleClickOpen}
          addDelete={false}
          addEdit={false}
          addCreate={false}
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

export default DepositTable;
