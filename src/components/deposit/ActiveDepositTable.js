import { Button } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAxios } from "../../hooks";
import { extractID } from "../../utils/extractID";
import { generateID } from "../../utils/generateID";
import { DeleteDialog, CustomTable } from "../common";

const ActiveDepositTable = ({ headCells }) => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getActiveDeposit = useCallback(async () => {
    setIsTableLoading(true);
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
      setRows(data);
      setIsTableLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const cancelDeposit = async () => {
    if (selected.length === 0) {
      return;
    }
    await api.put(`/api/deposit/cancel/${extractID(selected[0].id)}`);
    setOpenDeleteDialog(false);
    setSelected([]);
    getActiveDeposit();
  };

  useEffect(() => {
    getActiveDeposit();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <CustomTable
        tableConfig={{
          headCells: headCells,
          tableName: "Deposit",
          maxHeight: "60vh",
          atom: "activeDepositTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [],
          whenOneSelected: [
            {
              id: "active deposit table detail button",
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
                history.push({
                  pathname: `/dashboard/deposit/details/${extractID(
                    selected[0].id
                  )}`,
                  state: {
                    from: "active",
                  },
                });
              },
            },
            {
              id: "active deposit table delete button",
              component: memo(({ ...rest }) => (
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  sx={{ marginLeft: "5px" }}
                  {...rest}
                >
                  Cancel
                </Button>
              )),
              callback: (selected) => {
                setSelected(selected);
                setOpenDeleteDialog(true);
              },
            },
          ],
          whenMoreThanOneSelected: [],
        }}
      />
      <DeleteDialog
        isOpen={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        callbackButtonName="OK"
        content="You are about to cancel the deposit."
        callback={() => {
          cancelDeposit();
        }}
      />
    </>
  );
};

export default ActiveDepositTable;
