import { Button } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomTable } from "../../../components/common";
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
    id: "dateAndTime",
    numeric: false,
    disablePadding: false,
    label: "Date And Time",
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
  const history = useHistory();
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/inventory_transactions/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const dateAndTime = `${row.created_time.split("T")[0]} ${new Date(
          row.created_time
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}`;
        return {
          id: row.id,
          name: row?.inventory_item?.name || "",
          batch: row?.inventory_item?.batch || "",
          transaction_type_name: row?.transaction_type_name || "",
          quantity: row?.quantity || "",
          unit: row?.unit || "",
          opening_balance: row?.opening_balance || "",
          closing_balance: row?.closing_balance || "",
          selling_price: row?.selling_price || "",
          dateAndTime: dateAndTime,
          note: row?.note || "",
        };
      });
      setRows(data);
      setIsTableLoading(false);
    }
    return;
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <CustomTable
      tableConfig={{
        headCells: headCells,
        tableName: "Inventory Transaction",
        maxHeight: "62vh",
        atom: "inventoryTransactionTableAtom",
      }}
      data={rows}
      isLoading={isTableLoading}
      toolbarButtons={{
        whenNoneSelected: [
          {
            id: "inventory transaction table new button",
            component: memo(({ ...rest }) => (
              <Button variant="outlined" size="small" {...rest}>
                New
              </Button>
            )),
            callback: (selected) => {
              history.push("inventory_transaction/form");
            },
          },
        ],
        whenOneSelected: [
          {
            id: "inventory transaction table detail button",
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
              history.push(`inventory_transaction/details/${selected[0].id}`);
            },
          },
        ],
        whenMoreThanOneSelected: [],
      }}
    />
  );
};

export default InventoryTransactionTable;
