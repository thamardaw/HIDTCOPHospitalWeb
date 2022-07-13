import { Button, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import {
  CancelledBillTable,
  CompletedBillTable,
  DraftedBillTable,
  OutstandingBillTable,
  TabPanel,
} from "../../../components";

import tabAtom from "../../../recoil/tab";

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
  const history = useHistory();
  const [tab, setTab] = useRecoilState(tabAtom("billTabAtom"));

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

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
        <DraftedBillTable headCells={headCells} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <OutstandingBillTable headCells={headCells} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <CompletedBillTable headCells={headCells} />
      </TabPanel>
      <TabPanel value={tab} index={3}>
        <CancelledBillTable headCells={headCells} />
      </TabPanel>
    </Box>
  );
};

export default BillsTable;
