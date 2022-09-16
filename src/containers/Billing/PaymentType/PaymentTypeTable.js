import { memo, useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router";
import { Button } from "@mui/material";
import { CustomTable, DeleteDialog } from "../../../components/common";
import { useAxios } from "../../../hooks";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablepadding: true,
    label: "ID"
  },
  {
    id: "name",
    numeric: false,
    disablepadding: true,
    label: "Name"
  }
]
const PaymentTypeTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = useCallback(async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/payment_types/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          name: row.name
        };
      });
      setRows(data);
      setIsTableLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const deleteItem = async () => {
    if (selected.length === 0) {
      return;
    } else if (selected.length === 1) {
      await api.delete(`/api/payment_types/${parseInt(selected[0].id)}`);
    } else if (selected.length > 1) {
      const listOfId = selected.map((item) => item.id);
      await api.post(`/api/payment_types/bulk`, {
        listOfId: listOfId,
      });
    }
    setOpenDeleteDialog(false);
    setSelected([]);
    getData();
  };
  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <CustomTable
        tableConfig={{
          headCells: headCells,
          tableName: "Payment Type",
          maxHeight: "62vh",
          atom: "paymentTypeAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [
            {
              id: "payment type table new button",
              component: memo(({ ...rest }) => (
                <Button variant="outlined" size="small" {...rest}>
                  New
                </Button>
              )),
              callback: (selected) => {
                history.push("paymentType/form");
              },
            },
          ],
          whenOneSelected: [
            {
              id: "payment type table edit button",
              component: memo(({ ...rest }) => (
                <Button variant="contained" size="small" {...rest}>
                  Edit
                </Button>
              )),
              callback: (selected) => {
                history.push(`paymentType/form/${selected[0].id}`);
              },
            },
            {
              id: "payment type table detail button",
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
                history.push(`paymentType/details/${selected[0].id}`);
              },
            },
            {
              id: "payment type table delete button",
              component: memo(({ ...rest }) => (
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  sx={{ marginLeft: "5px" }}
                  {...rest}
                >
                  Delete
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
        callback={() => {
          deleteItem();
        }}
      />
    </>
  )
}

export default PaymentTypeTable