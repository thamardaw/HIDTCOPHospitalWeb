// import { useContext, useState } from "react";
import { CustomTable } from "../../../components";
// import { LoadingContext } from "../../../contexts";
// import { useAxios } from "../../../hooks";

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
  // const api = useAxios({ autoSnackbar: true });
  // const [rows, setRows] = useState([]);
  const rows = [];
  // const [open, setOpen] = useState(false);
  // const [selected, setSelected] = useState([]);
  // const { setScreenLoading } = useContext(LoadingContext);

  const handleClickOpen = (arr) => {
    // setSelected(arr);
    // setOpen(true);
  };

  return (
    <CustomTable
      tableName="Pharmacy Item"
      headCells={headCells}
      rows={rows}
      onDelete={handleClickOpen}
      enableMultipleDelete={false}
    />
  );
};

export default PharmacyItemTable;
