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
import { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomTable, TabPanel } from "../../../components";
import LoadingContext from "../../../contexts/LoadingContext";
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
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
];
const DepositTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [activeRows, setActiveRows] = useState([]);
  const [usedRows, setUsedRows] = useState([]);
  const [cancelledRows, setCancelledRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [tab, setTab] = useState(0);
  const { setScreenLoading } = useContext(LoadingContext);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const handleClickOpen = (arr) => {
    setSelected(arr);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getActiveDeposit = useCallback(async () => {
    setScreenLoading(true);
    const res = await api.get("/api/deposit/active");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id);
        return {
          id: ID,
          patient_name: row.patient.name,
          patient_id: generateID(row.patient_id, row.patient.created_time),
          amount: row.amount,
          date: row.created_time.split("T")[0],
        };
      });
      setActiveRows(data);
      setScreenLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const getUsedDeposit = useCallback(async () => {
    const res = await api.get("/api/deposit/used");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id);
        return {
          id: ID,
          patient_name: row.patient.name,
          patient_id: generateID(row.patient_id, row.patient.created_time),
          amount: row.amount,
          date: row.created_time.split("T")[0],
        };
      });
      setUsedRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const getCancelledDeposit = useCallback(async () => {
    const res = await api.get("/api/deposit/cancelled");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id);
        return {
          id: ID,
          patient_name: row.patient.name,
          patient_id: generateID(row.patient_id, row.patient.created_time),
          amount: row.amount,
          date: row.created_time.split("T")[0],
        };
      });
      setCancelledRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const cancelDeposit = async () => {
    if (selected.length === 0) {
      return;
    }
    await api.put(
      `/api/deposit/cancel/${parseInt(selected[0].id.split("-")[1])}`
    );
    handleClose();
    setSelected([]);
    getActiveDeposit();
    getUsedDeposit();
    getCancelledDeposit();
  };

  useEffect(() => {
    getActiveDeposit();
    getUsedDeposit();
    getCancelledDeposit();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="outlined"
          size="small"
          onClick={() => history.push(`/dashboard/deposit/form`)}
        >
          New Deposit
        </Button>
      </Box>
      <Box display="flex" justifyContent="center" width="100%">
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab label="Active" />
          <Tab label="Used" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <CustomTable
          tableName="Deposit"
          headCells={headCells}
          rows={activeRows}
          onDelete={handleClickOpen}
          onDetail={(id) =>
            history.push({
              pathname: `/dashboard/deposit/details/${id}`,
              state: {
                from: "active",
              },
            })
          }
          addEdit={false}
          addCreate={false}
          deleteBtnName="Cancel"
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
      <TabPanel value={tab} index={2}>
        <CustomTable
          tableName="Deposit"
          headCells={headCells}
          rows={cancelledRows}
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
            Are you sure you want to cancel the deposit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={cancelDeposit} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DepositTable;
