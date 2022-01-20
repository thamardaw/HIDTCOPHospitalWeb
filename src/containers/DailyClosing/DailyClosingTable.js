import { Box } from "@mui/system";
import { useCallback, useContext, useEffect, useState } from "react";
import { CustomTable } from "../../components";
import LoadingContext from "../../contexts/LoadingContext";
import { useAxios } from "../../hooks";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "opening_balance",
    numeric: false,
    disablePadding: false,
    label: "Opening Balance",
  },
  {
    id: "bill_total",
    numeric: false,
    disablePadding: false,
    label: "Bill Total",
  },
  {
    id: "deposit_total",
    numeric: false,
    disablePadding: false,
    label: "Deposit Total",
  },
  {
    id: "grand_total",
    numeric: false,
    disablePadding: false,
    label: "Grand Total",
  },
  {
    id: "actual_amount",
    numeric: false,
    disablePadding: false,
    label: "Actual Amount",
  },
  {
    id: "adjusted_amount",
    numeric: false,
    disablePadding: false,
    label: "Adjusted Amount",
  },
  {
    id: "adjusted_reason",
    numeric: false,
    disablePadding: false,
    label: "Reason",
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
  },
];
const DailyClosingTable = () => {
  const api = useAxios();
  const [rows, setRows] = useState([]);
  const { setScreenLoading } = useContext(LoadingContext);

  const handleClickOpen = (id) => {};

  const getData = useCallback(async () => {
    setScreenLoading(true);
    const res = await api.get("/api/dailyClosing/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id.toString(),
          opening_balance: row.opening_balance.toString(),
          bill_total: row.bill_total.toString(),
          deposit_total: row.deposit_total.toString(),
          grand_total: row.grand_total.toString(),
          actual_amount: row.actual_amount.toString(),
          adjusted_amount: row.adjusted_amount.toString(),
          adjusted_reason: row.adjusted_reason,
          date: row.created_time.split("T")[0],
        };
      });
      setRows(data);
      setScreenLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <CustomTable
        tableName="Daily Closing"
        headCells={headCells}
        rows={rows}
        onDelete={handleClickOpen}
        addDelete={false}
        addEdit={false}
      />
    </Box>
  );
};

export default DailyClosingTable;
