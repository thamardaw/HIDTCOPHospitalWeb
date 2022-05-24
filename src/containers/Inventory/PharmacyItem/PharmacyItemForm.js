import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
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

const PharmacyItemForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [checked, setChecked] = useState(false);

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
            <Typography variant="p">Category</Typography>
          </Box>
          <TextField
            select
            fullWidth
            label="Category"
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.category_id || ""}
            name="category_id"
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
            <Typography variant="p">Brand Name</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.brand_name || ""}
            name="brand_name"
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
            <Typography variant="p">Generic Name</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.generic_name || ""}
            name="generic_name"
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
            <Typography variant="p">Form</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.form || ""}
            name="form"
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
            <Typography variant="p">Strength</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.strength || ""}
            name="strength"
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
            <Typography variant="p">PO-unit</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.po_unit || ""}
            name="po_unit"
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
            <Typography variant="p">Unit</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.unit || ""}
            name="unit"
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
            <Typography variant="p">Unit Conversion</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.unit_converrion || ""}
            name="unit_converrion"
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
            <Typography variant="p">Create Inventory</Typography>
          </Box>
          <Checkbox
            size="large"
            sx={{ paddingLeft: 0 }}
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
        </Box>
        {checked && (
          <>
            {" "}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="p">Balance</Typography>
              </Box>
              <TextField
                size="small"
                sx={{ width: "70%" }}
                margin="dense"
                value={details?.balance || ""}
                name="balance"
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
                <Typography variant="p">Unit</Typography>
              </Box>
              <TextField
                select
                fullWidth
                label="Unit"
                size="small"
                sx={{ width: "70%" }}
                margin="dense"
                value={details?.unit || ""}
                name="unit"
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
                <Typography variant="p">Expiry Date</Typography>
              </Box>
              <TextField
                size="small"
                sx={{ width: "70%" }}
                margin="dense"
                placeholder="YYYY-MM-DD"
                value={details?.expiry_date || ""}
                name="expiry_date"
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
                <Typography variant="p">Batch</Typography>
              </Box>
              <TextField
                size="small"
                sx={{ width: "70%" }}
                margin="dense"
                value={details?.batch || ""}
                name="batch"
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
                <Typography variant="p">Purchasing Price</Typography>
              </Box>
              <TextField
                size="small"
                sx={{ width: "70%" }}
                margin="dense"
                value={details?.purchasing_price || ""}
                name="purchasing_price"
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
                <Typography variant="p">Selling Price</Typography>
              </Box>
              <TextField
                size="small"
                sx={{ width: "70%" }}
                margin="dense"
                value={details?.selling_price || ""}
                name="selling_price"
                onChange={handleChange}
              />
            </Box>
          </>
        )}
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

export default PharmacyItemForm;
