import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Divider,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { BackButton } from "../../../components";
import { useAxios } from "../../../hooks";

const InventoryTransactionForm = () => {
  const history = useHistory();
  const api = useAxios({ autoSnackbar: true });
  const [loading, setLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [details, setDetails] = useState({});

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const getInventoryItemsAndTransactionType = async () => {
    const [invi, txt] = await Promise.all([
      api.get("/api/inventory_items/"),
      api.get("/api/transaction_types/"),
    ]);
    if (invi.status === 200 && txt.status === 200) {
      setInventoryItems(invi.data);
      setTransactionTypes(txt.data);
    } else {
      history.goBack();
    }
    return;
  };

  const createNew = async () => {
    setLoading(true);
    const txt = transactionTypes.find(
      (t) => t.id === details.transaction_type_id
    );
    const res = await api.post("/api/inventory_transactions/", {
      ...details,
      transaction_type_name: txt.name,
      transaction_type: txt.type,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  useEffect(() => {
    getInventoryItemsAndTransactionType();
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar
        sx={{
          display: "flex",
          paddingLeft: "12px",
        }}
        variant="dense"
        disableGutters={true}
      >
        <BackButton backFunction={() => history.goBack()} />
        <Typography variant="h5">New</Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Inventory Item</Typography>
          </Box>
          <Autocomplete
            options={inventoryItems}
            style={{ width: "70%" }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(e, value) => {
              setDetails({
                ...details,
                inventory_item_id: value.id,
                inventory_item_name: value.name,
                unit: value.unit,
                purchasing_price: value.purchasing_price,
                selling_price: value?.sales_service_item?.price,
              });
            }}
            renderOption={(props, option) => {
              return (
                <Box {...props} key={option.id}>
                  {option.name}
                </Box>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                fullWidth
                size="small"
                margin="normal"
              />
            )}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Transaction Type</Typography>
          </Box>
          <TextField
            select
            fullWidth
            label="Type"
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.transaction_type_id || ""}
            name="transaction_type_id"
            onChange={handleChange}
          >
            {transactionTypes.map((txt) => (
              <MenuItem key={txt.id} value={txt.id}>
                {txt.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Quantity</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.quantity || ""}
            name="quantity"
            onChange={handleChange}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Note</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            multiline
            rows={3}
            value={details?.note || ""}
            name="note"
            onChange={handleChange}
          />
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "20px 10px",
        }}
      >
        <LoadingButton
          variant="contained"
          loading={loading}
          size="small"
          sx={{ marginRight: "5px" }}
          onClick={createNew}
        >
          Save
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default InventoryTransactionForm;
