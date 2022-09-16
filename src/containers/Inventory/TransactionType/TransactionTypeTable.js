import { memo, useEffect, useState } from "react";
import { DeleteDialog,CustomTable } from "../../../components/common";
import { useAxios } from "../../../hooks";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";

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
    label: "Name",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Type",
  },
];

const TransactionTypeTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/transaction_types/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          name: row.name || "",
          type: row.type || "",
        };
      });
      setRows(data);
      setIsTableLoading(false);
    }
    return;
  };

  const deleteItem = async () => {
    if (selected.length === 0) {
      return;
    } else if (selected.length === 1) {
      await api.delete(`/api/transaction_types/${parseInt(selected[0].id)}`);
    } else if (selected.length > 1) {
      const extractedID = selected.map((item) => {
        return item.id;
      });
      await api.post(`/api/transaction_types/bulk`, {
        listOfId: extractedID,
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
          tableName: "Transaction Type",
          maxHeight: "62vh",
          atom: "transactionTypeTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [
            {
              id: "transaction type table new button",
              component: memo(({ ...rest }) => (
                <Button variant="outlined" size="small" {...rest}>
                  New
                </Button>
              )),
              callback: (selected) => {
                history.push("transaction_type/form");
              },
            },
          ],
          whenOneSelected: [
            {
              id: "transaction type table edit button",
              component: memo(({ ...rest }) => (
                <Button variant="contained" size="small" {...rest}>
                  Edit
                </Button>
              )),
              callback: (selected) => {
                history.push(`transaction_type/form/${selected[0].id}`);
              },
            },
            {
              id: "transaction type table detail button",
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
                history.push(`transaction_type/details/${selected[0].id}`);
              },
            },
            {
              id: "transaction type table delete button",
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
  );
};

export default TransactionTypeTable;
