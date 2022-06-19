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
    id: "brand_name",
    numeric: false,
    disablePadding: false,
    label: "Brand Name",
  },
  {
    id: "balance",
    numeric: false,
    disablePadding: false,
    label: "Balance",
  },
  {
    id: "unit",
    numeric: false,
    disablePadding: false,
    label: "Unit",
  },
  {
    id: "purchasing_price",
    numeric: false,
    disablePadding: false,
    label: "Purchasing Price",
  },
  {
    id: "selling_price",
    numeric: false,
    disablePadding: false,
    label: "Selling Price",
  },
  {
    id: "expiry_date",
    numeric: false,
    disablePadding: false,
    label: "Expiry Date",
  },
];

const InventoryItemTable = () => {
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
    const res = await api.get("/api/inventory_items/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          brand_name: row?.pharmacy_item?.brand_name,
          balance: row?.balance,
          unit: row?.unit,
          purchasing_price: row?.purchasing_price,
          selling_price: row?.sales_service_item?.price,
          expiry_date: row?.expiry_date,
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
      await api.delete(`/api/inventory_items/${parseInt(selected[0].id)}`);
    } else if (selected.length > 1) {
      const extractedID = selected.map((item) => {
        return item.id;
      });
      await api.post(`/api/inventory_items/bulk`, {
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
        tableName="Inventory Item"
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

export default InventoryItemTable;
