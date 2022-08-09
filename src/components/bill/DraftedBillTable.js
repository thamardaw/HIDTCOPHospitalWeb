import { Button } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAxios } from "../../hooks";
import { extractID } from "../../utils/extractID";
import { generateID } from "../../utils/generateID";
import { DeleteDialog, CustomTable } from "../common";

const DraftedBillTable = ({ headCells }) => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getDraftedData = useCallback(async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/bill/drafted");
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
    console.log(extractID(selected[0].id));
    if (selected.length === 0) return;
    const [b, inv] = await Promise.all([
      api.put(`/api/bill/cancel/${extractID(selected[0].id)}`),
      api.post("/api/inventory/returns", [...selected[0]?.bill_items]),
    ]);
    if (b.status === 200 && inv.status === 200) {
      setOpenDeleteDialog(false);
      setSelected([]);
      getDraftedData();
    }
  };

  useEffect(() => {
    getDraftedData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <CustomTable
        tableConfig={{
          headCells: headCells,
          tableName: "Bill",
          maxHeight: "60vh",
          atom: "draftedBillTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [],
          whenOneSelected: [
            {
              id: "drafted bill table edit button",
              component: memo(({ ...rest }) => (
                <Button variant="contained" size="small" {...rest}>
                  Edit
                </Button>
              )),
              callback: (selected) => {
                history.push(
                  `/dashboard/bills/form/${extractID(selected[0].id)}`
                );
              },
            },
            {
              id: "drafted bill table detail button",
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
                  `/dashboard/bills/details/${extractID(selected[0].id)}/draft`
                );
              },
            },
            {
              id: "drafted bill table delete button",
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
        content="You are about to cancel the bill."
        callback={() => {
          cancelBill();
        }}
      />
    </>
  );
};

export default DraftedBillTable;
