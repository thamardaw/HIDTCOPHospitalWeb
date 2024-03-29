import { Button } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DeleteDialog,CustomTable } from "../../../components/common";
import { useAxios } from "../../../hooks";

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
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = useCallback(async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/salesServiceItem/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
          price: row.price,
          uom: row.uom?.name,
          category: row.category?.name,
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
      await api.delete(`/api/salesServiceItem/${parseInt(selected[0].id)}`);
    } else if (selected.length > 1) {
      const listOfId = selected.map((item) => item.id);
      await api.post(`/api/salesServiceItem/bulk`, {
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
          tableName: "Item",
          maxHeight: "62vh",
          atom: "salesSeriveItemTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [
            {
              id: "ssi table new button",
              component: memo(({ ...rest }) => (
                <Button variant="outlined" size="small" {...rest}>
                  New
                </Button>
              )),
              callback: (selected) => {
                history.push("salesServiceItem/form");
              },
            },
          ],
          whenOneSelected: [
            {
              id: "ssi table edit button",
              component: memo(({ ...rest }) => (
                <Button variant="contained" size="small" {...rest}>
                  Edit
                </Button>
              )),
              callback: (selected) => {
                history.push(`salesServiceItem/form/${selected[0].id}`);
              },
            },
            {
              id: "ssi table detail button",
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
                history.push(`salesServiceItem/details/${selected[0].id}`);
              },
            },
            {
              id: "ssi table delete button",
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

export default SalesServiceItemTable;
