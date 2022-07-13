import { Button } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAxios } from "../hooks";
import { generateID } from "../utils/generateID";
import CustomTable from "./CustomTable";

const UsedDepositTable = ({ headCells }) => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getUsedDeposit = useCallback(async () => {
    setIsTableLoading(true);

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
      setRows(data);

      setIsTableLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getUsedDeposit();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <CustomTable
        tableConfig={{
          headCells: headCells,
          tableName: "Deposit",
          maxHeight: "60vh",
          atom: "usedDepositTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [],
          whenOneSelected: [
            {
              id: "used deposit table detail button",
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
                history.push(`deposit/details/${selected[0].id}`);
              },
            },
          ],
          whenMoreThanOneSelected: [],
        }}
      />
    </>
  );
};

export default UsedDepositTable;
