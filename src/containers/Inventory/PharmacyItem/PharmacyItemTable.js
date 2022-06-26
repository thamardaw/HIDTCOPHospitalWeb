import { useContext, useEffect, useState } from "react";
import { CustomTable, DeleteDialog } from "../../../components";
import { LoadingContext } from "../../../contexts";
import { useAxios } from "../../../hooks";

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
    id: "generic_name",
    numeric: false,
    disablePadding: false,
    label: "Generic Name",
  },
  {
    id: "form",
    numeric: false,
    disablePadding: false,
    label: "Form",
  },
  {
    id: "strength",
    numeric: false,
    disablePadding: false,
    label: "Strength",
  },
  {
    id: "po_unit",
    numeric: false,
    disablePadding: false,
    label: "PO-unit",
  },
  {
    id: "unit",
    numeric: false,
    disablePadding: false,
    label: "Unit",
  },
];

const PharmacyItemTable = () => {
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
    const res = await api.get("/api/pharmacy_items/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          brand_name: row.brand_name || "",
          generic_name: row.generic_name || "",
          form: row.form || "",
          strength: row.strength || "",
          po_unit: row.po_unit || "",
          unit: row.unit || "",
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
      await api.delete(`/api/pharmacy_items/${parseInt(selected[0].id)}`);
    } else if (selected.length > 1) {
      const extractedID = selected.map((item) => {
        return item.id;
      });
      await api.post(`/api/pharmacy_items/bulk`, {
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
        tableName="Pharmacy Item"
        headCells={headCells}
        rows={rows}
        onDelete={handleClickOpenDeleteDialog}
        addDelete={false}
        enableMultipleDelete={false}
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

export default PharmacyItemTable;
