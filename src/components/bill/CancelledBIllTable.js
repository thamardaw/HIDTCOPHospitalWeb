import { Button } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAxios } from "../../hooks";
import { extractID } from "../../utils/extractID";
import { generateID } from "../../utils/generateID";
import { CustomTable } from "../common";

const CancelledBillTable = ({ headCells }) => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getCancelledData = useCallback(async () => {
    setIsTableLoading(true);
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
          created_date: row.created_time.split("T")[0],
        };
      });
      setRows(data);
      setIsTableLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getCancelledData();
    // eslint-disable-next-line
  }, []);

  return (
    <CustomTable
      tableConfig={{
        headCells: headCells,
        tableName: "Bill",
        maxHeight: "60vh",
        atom: "cancelledBillTableAtom",
      }}
      data={rows}
      isLoading={isTableLoading}
      toolbarButtons={{
        whenNoneSelected: [],
        whenOneSelected: [
          {
            id: "cancelled bill table detail button",
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
              history.push(
                `/dashboard/bills/details/${extractID(
                  selected[0].id
                )}/cancelled`
              );
            },
          },
        ],
        whenMoreThanOneSelected: [],
      }}
    />
  );
};

export default CancelledBillTable;
