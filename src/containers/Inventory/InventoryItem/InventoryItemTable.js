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
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/inventory_items/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          name: row?.name || "",
          balance: row?.balance || "",
          unit: row?.unit || "",
          purchasing_price: row?.purchasing_price || "",
          selling_price: row?.sales_service_item?.price || "",
          expiry_date: row?.expiry_date || "",
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
      await api.delete(`/api/inventory_items/${parseInt(selected[0].id)}`);
    } else if (selected.length > 1) {
      const extractedID = selected.map((item) => {
        return item.id;
      });
      await api.post(`/api/inventory_items/bulk`, {
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
          tableName: "Inventory Item",
          maxHeight: "62vh",
          atom: "inventoryItemTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [
            {
              id: "inventory item table new button",
              component: memo(({ ...rest }) => (
                <Button variant="outlined" size="small" {...rest}>
                  New
                </Button>
              )),
              callback: (selected) => {
                history.push("inventory_item/form");
              },
            },
          ],
          whenOneSelected: [
            {
              id: "inventory item table edit button",
              component: memo(({ ...rest }) => (
                <Button variant="contained" size="small" {...rest}>
                  Edit
                </Button>
              )),
              callback: (selected) => {
                history.push(`inventory_item/form/${selected[0].id}`);
              },
            },
            {
              id: "inventory item table detail button",
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
                history.push(`inventory_item/details/${selected[0].id}`);
              },
            },
            {
              id: "inventory item table delete button",
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

export default InventoryItemTable;
