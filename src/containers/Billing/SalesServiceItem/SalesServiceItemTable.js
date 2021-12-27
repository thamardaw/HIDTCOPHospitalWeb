import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { CustomTable } from "../../../components";
import { useAxios } from "../../../hooks";
import { generateID } from "../../../utils/generateID";

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
    id: "price",
    numeric: false,
    disablePadding: false,
    label: "Price",
  },
  {
    id: "uom",
    numeric: false,
    disablePadding: false,
    label: "UOM",
  },
  {
    id: "category",
    numeric: false,
    disablePadding: false,
    label: "Category",
  },
];
const SalesServiceItemTable = () => {
  const api = useAxios();
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");

  const handleClickOpen = (id) => {
    setId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = useCallback(async () => {
    const res = await api.get("/api/salesServiceItem/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        return {
          id: ID,
          name: row.name,
          price: row.price.toString(),
          uom: row.uom.name,
          category: row.category.name,
        };
      });
      setRows(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const deleteItem = async () => {
    await api.delete(`/api/salesServiceItem/${parseInt(id.split("-")[1])}`);
    handleClose();
    getData();
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <CustomTable
        tableName="Item"
        headCells={headCells}
        rows={rows}
        onDelete={handleClickOpen}
      />
      <Dialog
        open={open}
        onClose={handleClose}
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteItem} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesServiceItemTable;
