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
import { useCallback, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomTable, TabPanel } from "../../../components";
import { CacheContext } from "../../../contexts";
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
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
];

const BillsTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [draftedRows, setDraftedRows] = useState([]);
  const [outstandingRows, setOutstandingRows] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [cancelledRows, setCancelledRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  // const [tab, setTab] = useState(false);
  const { setScreenLoading } = useContext(LoadingContext);
  const { table, viewTab } = useContext(CacheContext);
  const { resetTable } = table;
  const { tab, setTab } = viewTab;

  const handleTabChange = (event, newTab) => {
    resetTable();
    setTab(newTab);
  };

  const handleClickOpen = (arr) => {
    setSelected(arr);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toDetailFromOutstanding = (id) => {
    history.push(
      `/dashboard/bills/details/${parseInt(id.split("-")[1])}/outstanding`
    );
  };

  const toDetailFromDrafted = (id) => {
    history.push(
      `/dashboard/bills/details/${parseInt(id.split("-")[1])}/draft`
    );
  };

  const toDetailFromCompleted = (id) => {
    history.push(
      `/dashboard/bills/details/${parseInt(id.split("-")[1])}/completed`
    );
  };

  const toDetailFromCancelled = (id) => {
    history.push(
      `/dashboard/bills/details/${parseInt(id.split("-")[1])}/cancelled`
    );
  };

  const getDraftedData = useCallback(async () => {
    setScreenLoading(true);
    const res = await api.get("/api/bill/drafted");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id);
        return {
          id: ID,
          name: row.patient_name,
          phone: row.patient_phone,
          address: row.patient_address,
          totalAmount: row.total_amount,
          date: row.created_time.split("T")[0],
        };
      });
      setDraftedRows(data);
      setScreenLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const getOutstandingData = useCallback(async () => {
    const res = await api.get("/api/bill/outstanding");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id);
        return {
          id: ID,
          name: row.patient_name,
          phone: row.patient_phone,
          address: row.patient_address,
          totalAmount: row.total_amount,
          date: row.created_time.split("T")[0],
        };
      });
      setOutstandingRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const getCompletedData = useCallback(async () => {
    const res = await api.get("/api/bill/completed");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id);
        return {
          id: ID,
          name: row.patient_name,
          phone: row.patient_phone,
          address: row.patient_address,
          totalAmount: row.total_amount,
          date: row.created_time.split("T")[0],
        };
      });
      setCompletedRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const getCancelledData = useCallback(async () => {
    const res = await api.get("/api/bill/cancelled");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id);
        return {
          id: ID,
          name: row.patient_name,
          phone: row.patient_phone,
          address: row.patient_address,
          totalAmount: row.total_amount,
          date: row.created_time.split("T")[0],
        };
      });
      setCancelledRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const cancelBill = async () => {
    if (selected.length === 0) {
      return;
    }
    await api.put(`/api/bill/cancel/${parseInt(selected[0].id.split("-")[1])}`);
    handleClose();
    setSelected([]);
    getDraftedData();
    getOutstandingData();
    getCompletedData();
    getCancelledData();
  };

  useEffect(() => {
    getDraftedData();
    getOutstandingData();
    getCompletedData();
    getCancelledData();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="flex-end" pt={1} pr={1}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => history.push(`/dashboard/bills/form`)}
        >
          New Bill
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
          <Tab label="Draft" />
          <Tab label="Outstanding" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>
      <TabPanel value={tab} index={0}>
        <CustomTable
          tableName="Bill"
          headCells={headCells}
          rows={draftedRows}
          addCreate={false}
          onDelete={handleClickOpen}
          onDetail={toDetailFromDrafted}
          deleteBtnName="Cancel"
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <CustomTable
          tableName="Bill"
          headCells={headCells}
          rows={outstandingRows}
          onDelete={handleClickOpen}
          onDetail={toDetailFromOutstanding}
          addCreate={false}
          addEdit={false}
          deleteBtnName="Cancel"
        />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <CustomTable
          tableName="Bill"
          headCells={headCells}
          rows={completedRows}
          onDelete={handleClickOpen}
          onDetail={toDetailFromCompleted}
          addDelete={false}
          addCreate={false}
          addEdit={false}
        />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <CustomTable
          tableName="Bill"
          headCells={headCells}
          rows={cancelledRows}
          onDelete={handleClickOpen}
          onDetail={toDetailFromCancelled}
          addDelete={false}
          addCreate={false}
          addEdit={false}
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
            Are you sure you want to cancel the bill?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={cancelBill} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BillsTable;
