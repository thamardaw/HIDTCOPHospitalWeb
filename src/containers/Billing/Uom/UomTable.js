import {
  Button,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomTable,DeleteDialog } from "../../../components";
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
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
];
const UomTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = useCallback(async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/uom/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          name: row.name,
          description: row.description,
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
      await api.delete(`/api/uom/${parseInt(selected[0].id)}`);
    } else if (selected.length > 1) {
      const listOfId = selected.map((item) => item.id);
      await api.post(`/api/uom/bulk`, {
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
          tableName: "UOM",
          maxHeight: "62vh",
          atom: "uomTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [
            {
              id: "uom table new button",
              component: memo(({ ...rest }) => (
                <Button variant="outlined" size="small" {...rest}>
                  New
                </Button>
              )),
              callback: (selected) => {
                history.push("uom/form");
              },
            },
          ],
          whenOneSelected: [
            {
              id: "uom table edit button",
              component: memo(({ ...rest }) => (
                <Button variant="contained" size="small" {...rest}>
                  Edit
                </Button>
              )),
              callback: (selected) => {
                history.push(`uom/form/${selected[0].id}`);
              },
            },
            {
              id: "uom table detail button",
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
                history.push(`uom/details/${selected[0].id}`);
              },
            },
            {
              id: "uom table delete button",
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

export default UomTable;
