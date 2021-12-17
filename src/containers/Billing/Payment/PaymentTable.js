import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomTable, TabPanel } from "../../../components";
import { useAxios } from "../../../hooks";
import { generateID } from "../../../utils/generateID";

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

const PaymentTable = () => {
  const api = useAxios();
  const history = useHistory();
  const [outstandingRows, setOutstandingRows] = useState([]);
  const [completedRows, setCompletedRows] = useState([]);
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const handleClickOpen = (id) => {};

  const toDetail = (id) => {
    history.push(`/dashboard/payment/details/${id}/completed`);
  };

  const getOutstandingData = useCallback(async () => {
    const res = await api.get("/api/payment/outstanding");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        return {
          id: ID,
          name: row.patient_name,
          phone: row.patient_phone,
          address: row.patient_address,
          totalAmount: row.total_amount,
        };
      });
      setOutstandingRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const getCompletedData = useCallback(async () => {
    const res = await api.get("/api/payment/completed");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        return {
          id: ID,
          name: row.patient_name,
          phone: row.patient_phone,
          address: row.patient_address,
          totalAmount: row.total_amount,
        };
      });
      setCompletedRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getOutstandingData();
    getCompletedData();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Outstanding" />
        <Tab label="Complete" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        <CustomTable
          tableName="Payment"
          headCells={headCells}
          rows={outstandingRows}
          onDelete={handleClickOpen}
          addDelete={false}
          addCreate={false}
          addEdit={false}
          detailBtnName="Pay"
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <CustomTable
          tableName="Payment"
          headCells={headCells}
          rows={completedRows}
          onDelete={handleClickOpen}
          onDetail={toDetail}
          addDelete={false}
          addCreate={false}
          addEdit={false}
        />
      </TabPanel>
    </Box>
  );
};

export default PaymentTable;
