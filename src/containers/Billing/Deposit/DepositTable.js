import { Button, Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { TabPanel } from "../../../components/common";
import {
  ActiveDepositTable,
  CancelledDepositTable,
  UsedDepositTable,
} from "../../../components/deposit";
import tabAtom from "../../../recoil/tab";

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
  const history = useHistory();
  const [tab, setTab] = useRecoilState(tabAtom("depositTabAtom"));

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box display="flex" justifyContent="flex-end" pt={1} pr={1}>
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
        <ActiveDepositTable headCells={headCells} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <UsedDepositTable headCells={headCells} />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <CancelledDepositTable headCells={headCells} />
      </TabPanel>
    </Box>
  );
};

export default DepositTable;
