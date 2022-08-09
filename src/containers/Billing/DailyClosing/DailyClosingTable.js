import { Button } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomTable } from "../../../components";
import { useAxios } from "../../../hooks";

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
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = useCallback(async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/dailyClosing/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          opening_balance: row.opening_balance,
          bill_total: row.bill_total,
          deposit_total: row.deposit_total,
          grand_total: row.grand_total,
          actual_amount: row.actual_amount,
          adjusted_amount: row.adjusted_amount,
          adjusted_reason: row.adjusted_reason,
          date: row.created_time.split("T")[0],
        };
      });
      setRows(data);
      setIsTableLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <CustomTable
      tableConfig={{
        headCells: headCells,
        tableName: "Daily Closing",
        maxHeight: "62vh",
        atom: "dailyClosingTableAtom",
      }}
      data={rows}
      isLoading={isTableLoading}
      toolbarButtons={{
        whenNoneSelected: [
          {
            id: "daily closing table new button",
            component: memo(({ ...rest }) => (
              <Button variant="outlined" size="small" {...rest}>
                New
              </Button>
            )),
            callback: (selected) => {
              history.push("dailyClosing/form");
            },
          },
        ],
        whenOneSelected: [
          {
            id: "daily closing table detail button",
            component: memo(({ ...rest }) => (
              <Button
                variant="contained"
                size="small"
                sx={{ marginLeft: "5px" }}
                {...rest}
              >
                Details
              </Button>
            )),
            callback: (selected) => {
              history.push(`dailyClosing/details/${selected[0].id}`);
            },
          },
        ],
        whenMoreThanOneSelected: [],
      }}
    />
  );
};

export default DailyClosingTable;
