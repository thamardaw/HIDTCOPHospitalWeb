import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAxios } from "../hooks";
import { extractID } from "../utils/extractID";
import { generateID } from "../utils/generateID";
import CustomTable from "./CustomTable";

const OutstandingBillTable = ({ headCells }) => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getOutstandingData = useCallback(async () => {
    setIsTableLoading(true);
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
          bill_items: row.bill_items,
        };
      });
      setRows(data);
      setIsTableLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const cancelBill = async () => {
    if (selected.length === 0) return;
    const [b, inv] = await Promise.all([
      api.put(`/api/bill/cancel/${extractID(selected[0].id)}`),
      api.post("/api/inventory/returns", [...selected[0]?.bill_items]),
    ]);
    if (b.status === 200 && inv.status === 200) {
      setOpenDeleteDialog(false);
      setSelected([]);
      getOutstandingData();
    }
  };

  useEffect(() => {
    getOutstandingData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <CustomTable
        tableConfig={{
          headCells: headCells,
          tableName: "Bill",
          maxHeight: "60vh",
          atom: "outstandingBillTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [],
          whenOneSelected: [
            {
              id: "outstanding bill table detail button",
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
                  )}/outstanding`
                );
              },
            },
            {
              id: "outstanding bill table delete button",
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
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
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
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={cancelBill} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OutstandingBillTable;
