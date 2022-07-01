import { useContext, useEffect, useState } from "react";
import { CustomTable } from "../../../components";
import { LoadingContext } from "../../../contexts";
import { useAxios } from "../../../hooks";
// import { CustomInventoryTransactionTable, CustomTable } from "../../../components";

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
    id: "transaction_type_name",
    numeric: false,
    disablePadding: false,
    label: "Transaction Type Name",
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
    id: "opening_balance",
    numeric: false,
    disablePadding: false,
    label: "Op Balance",
  },
  {
    id: "closing_balance",
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
    id: "note",
    numeric: false,
    disablePadding: false,
    label: "Note",
  },
];

const InventoryTransactionTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const [rows, setRows] = useState([]);
  const { setScreenLoading } = useContext(LoadingContext);

  const getData = async () => {
    setScreenLoading(true);
    const res = await api.get("/api/inventory_transactions/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          id: row.id,
          brand_name: row?.inventory_item?.pharmacy_item?.brand_name || "",
          generic_name: row?.inventory_item?.pharmacy_item?.generic_name || "",
          batch: row?.inventory_item?.batch || "",
          transaction_type_name: row?.transaction_type_name || "",
          quantity: row?.quantity || "",
          unit: row?.unit || "",
          opening_balance: row?.opening_balance || "",
          closing_balance: row?.closing_balance || "",
          selling_price: row?.selling_price || "",
          note: row?.note || "",
        };
      });
      setRows(data);
      setScreenLoading(false);
    }
    return;
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <CustomTable
      tableName="Inventory Transaction"
      headCells={headCells}
      rows={rows}
      addDelete={false}
      addEdit={false}
      enableMultipleDelete={false}
    />
  );
};

export default InventoryTransactionTable;
