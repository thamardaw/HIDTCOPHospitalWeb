import { useContext, useEffect, useState } from "react";
import { CustomTable } from "../../../components";
import { LoadingContext } from "../../../contexts";
import { useAxios } from "../../../hooks";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

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
  const [rows, setRows] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selected, setSelected] = useState([]);
  const { setScreenLoading } = useContext(LoadingContext);

  const handleClickOpenDeleteDialog = (arr) => {
    setSelected(arr);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const getData = async () => {
    setScreenLoading(true);
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
      setScreenLoading(false);
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
    handleCloseDeleteDialog();
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
        tableName="Transaction Type"
        headCells={headCells}
        rows={rows}
        onDelete={handleClickOpenDeleteDialog}
        enableMultipleDelete={false}
      />
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={deleteItem} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      {/* <DeleteDialog
        isOpen={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        callback={() => {
          deleteItem();
        }}
      /> */}
    </>
  );
};

export default TransactionTypeTable;
