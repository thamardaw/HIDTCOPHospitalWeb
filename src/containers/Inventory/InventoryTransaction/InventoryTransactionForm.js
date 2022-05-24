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
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton } from "../../../components";
import { useAxios } from "../../../hooks";

const InventoryTransactionForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

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
        <Typography variant="h5">{id ? "Edit" : "New"}</Typography>
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
            options={[]}
            style={{ width: "70%" }}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => {
              return (
                <Box {...props} key={option.sales_service_item_id}>
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
            label="Unit"
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.transaction_type || ""}
            name="transaction_type"
            onChange={handleChange}
          >
            {/* <MenuItem value="male">Male</MenuItem> */}
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
            value={details?.selling_price || ""}
            name="selling_price"
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
          // onClick={id ? update : createNew}
        >
          Save
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default InventoryTransactionForm;
