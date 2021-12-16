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

const BillsTable = () => {
  const api = useAxios();
  const history = useHistory();
  const [draftedRows, setDraftedRows] = useState([]);
  const [printedRows, setPrintedRows] = useState([]);
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const handleClickOpen = (id) => {};

  const toDetail = (id) => {
    history.push(`/dashboard/payment/details/${id}`);
  };

  const getDraftedData = useCallback(async () => {
    const res = await api.get("/api/bill/drafted");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        return {
          id: ID,
          name: row.patient_name,
          phone: row.patient_phone,
          address: row.patient_age,
          totalAmount: row.total_amount,
        };
      });
      setDraftedRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const getPrintedData = useCallback(async () => {
    const res = await api.get("/api/bill/printed");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        return {
          id: ID,
          name: row.patient_name,
          phone: row.patient_phone,
          address: row.patient_age,
          totalAmount: row.total_amount.toString(),
        };
      });
      setPrintedRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getDraftedData();
    getPrintedData();
    // eslint-disable-next-line
  }, []);

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
          rows={draftedRows}
          onDelete={handleClickOpen}
          onDetail={toDetail}
          addDelete={false}
        />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <CustomTable
          tableName="Printed Bills"
          headCells={headCells}
          rows={printedRows}
          onDelete={handleClickOpen}
          onDetail={toDetail}
          addDelete={false}
          addEdit={false}
        />
      </TabPanel>
    </Box>
  );
};

export default BillsTable;
