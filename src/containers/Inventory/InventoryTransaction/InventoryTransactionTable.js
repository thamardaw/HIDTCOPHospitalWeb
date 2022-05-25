import { useContext, useState } from "react";
import { LoadingContext } from "../../../contexts";
import { useAxios } from "../../../hooks";
import { CustomInventoryTransactionTable } from "../../../components";

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
    id: "batch",
    numeric: false,
    disablePadding: false,
    label: "Batch",
  },
  {
    id: "transaction_type",
    numeric: false,
    disablePadding: false,
    label: "Transaction Type",
  },
  {
    id: "quantity",
    numeric: false,
    disablePadding: false,
    label: "Quantity",
  },
  {
    id: "unit",
    numeric: false,
    disablePadding: false,
    label: "Unit",
  },
  {
    id: "op_balance",
    numeric: false,
    disablePadding: false,
    label: "Op Balance",
  },
  {
    id: "cl_balance",
    numeric: false,
    disablePadding: false,
    label: "CL Balance",
  },
  {
    id: "selling_price",
    numeric: false,
    disablePadding: false,
    label: "Selling Price",
  },
  {
    id: "opening_balance",
    numeric: false,
    disablePadding: false,
    label: "Opening Balance",
  },
  {
    id: "note",
    numeric: false,
    disablePadding: false,
    label: "Note",
  },
];

const InventoryTransactionTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const [rows, setRows] = useState([{ id: "1" }]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const { setScreenLoading } = useContext(LoadingContext);

  const handleClickOpen = (arr) => {
    setSelected(arr);
    setOpen(true);
  };

  return (
    <CustomInventoryTransactionTable
      tableName="Inventory Transaction"
      headCells={headCells}
      rows={rows}
      onDelete={handleClickOpen}
      enableMultipleDelete={false}
    />
  );
};

export default InventoryTransactionTable;
