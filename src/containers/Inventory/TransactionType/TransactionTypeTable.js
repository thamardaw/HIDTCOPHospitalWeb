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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const { setScreenLoading } = useContext(LoadingContext);

  const handleClickOpen = (arr) => {
    setSelected(arr);
    setOpen(true);
  };
  return (
    <CustomTable
      tableName="Transaction Type"
      headCells={headCells}
      rows={rows}
      onDelete={handleClickOpen}
      enableMultipleDelete={false}
    />
  );
};

export default TransactionTypeTable;
