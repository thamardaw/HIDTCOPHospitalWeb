import { useContext, useState } from "react";
import { CustomTable } from "../../../components";
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
    id: "total",
    numeric: false,
    disablePadding: false,
    label: "Total",
  },
];

const InventoryItemTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const { setScreenLoading } = useContext(LoadingContext);

  const handleClickOpen = (arr) => {
    setSelected(arr);
    setOpen(true);
  };

  return (
    <CustomTable
      tableName="Inventory Item"
      headCells={headCells}
      rows={rows}
      onDelete={handleClickOpen}
      enableMultipleDelete={false}
    />
  );
};

export default InventoryItemTable;
