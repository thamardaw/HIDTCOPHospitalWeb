import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Checkbox,
  MenuItem,
  Divider,
  TextField,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton, CSVUploadDialog } from "../../../components";
import { useAxios } from "../../../hooks";

const PharmacyItemForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    po_unit: "",
    unit: "",
  });
  const [inventoryDetails, setInventoryDetails] = useState({});
  const [checked, setChecked] = useState(false);
  const [categories, setCategories] = useState([]);
  const [SSI, setSSI] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "po_unit" || e.target.name === "unit") {
      setInventoryDetails({
        ...inventoryDetails,
        unit: "",
      });
    }
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleInventoryChange = (e) => {
    setInventoryDetails({
      ...inventoryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const getCategories = async () => {
    const res = await api.get("/api/category/");
    if (res.status === 200) {
      setCategories(res.data);
    } else {
      history.goBack();
    }
  };

  const getSSI = async () => {
    const res = await api.get("/api/salesServiceItem/");
    if (res.status === 200) {
      setSSI(res.data);
    }
  };

  const getData = async () => {
    const res = await api.get(`/api/pharmacy_items/${parseInt(id)}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
  };

  const createNew = async () => {
    setLoading(true);
    const res = await api.post(`/api/pharmacy_items/`, {
      ...details,
      with_inventory: checked
        ? {
            ...inventoryDetails,
          }
        : null,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  const update = async () => {
    setLoading(true);
    const res = await api.put(`/api/pharmacy_items/`, {
      ...details,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!id) {
      setInventoryDetails({ ...inventoryDetails, name: details.brand_name });
    }
    // eslint-disable-next-line
  }, [id, details.brand_name]);

  useEffect(() => {
    getCategories();
    getSSI();
    if (id) getData();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
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
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category?.name}
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
              value={details?.converstion_rate || ""}
              name="converstion_rate"
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{
              display: id ? "none" : "flex",
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <Typography variant="p">Name</Typography>
                </Box>
                <TextField
                  size="small"
                  sx={{ width: "70%" }}
                  margin="dense"
                  value={inventoryDetails?.name || ""}
                  name="name"
                  onChange={handleInventoryChange}
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
                  <Typography variant="p">Balance</Typography>
                </Box>
                <TextField
                  size="small"
                  sx={{ width: "70%" }}
                  margin="dense"
                  value={inventoryDetails?.balance || ""}
                  name="balance"
                  onChange={handleInventoryChange}
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
                  value={inventoryDetails?.unit || ""}
                  name="unit"
                  onChange={handleInventoryChange}
                >
                  {details?.po_unit && (
                    <MenuItem value={details?.po_unit}>
                      {details?.po_unit}
                    </MenuItem>
                  )}
                  {details?.unit && (
                    <MenuItem value={details?.unit}>{details?.unit}</MenuItem>
                  )}
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
                  value={inventoryDetails?.expiry_date || ""}
                  name="expiry_date"
                  onChange={handleInventoryChange}
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
                  value={inventoryDetails?.batch || ""}
                  name="batch"
                  onChange={handleInventoryChange}
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
                  value={inventoryDetails?.purchasing_price || ""}
                  name="purchasing_price"
                  onChange={handleInventoryChange}
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
                  <Typography variant="p">Sales Item</Typography>
                </Box>
                <Autocomplete
                  options={SSI}
                  style={{ width: "70%" }}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option) => {
                    return (
                      <Box {...props} key={option.id}>
                        {option.name}
                      </Box>
                    );
                  }}
                  onChange={(event, newValue) => {
                    setInventoryDetails({
                      ...inventoryDetails,
                      sales_service_item_id: newValue?.id,
                    });
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
          <Button
            variant="outlined"
            size="small"
            sx={{ marginRight: "5px", display: id ? "none" : "block" }}
            onClick={handleOpenDialog}
          >
            Upload
          </Button>
          <LoadingButton
            variant="contained"
            loading={loading}
            size="small"
            sx={{ marginRight: "5px" }}
            onClick={id ? update : createNew}
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
      <CSVUploadDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        columns={[
          "category_id",
          "brand_name",
          "generic_name",
          "form",
          "strength",
          "unit",
          "po_unit",
          "converstion_rate",
        ]}
        example_rows={[
          {
            category_id:
              "Please don't touch row 1 and look at row 3 for field description and example values. Columns with comma seperated values are the only valid value for those field. REMOVE ROW 2 AND 3 BEFORE UPLOADING.",
          },
          {
            category_id: "Category ID",
            brand_name: "Brand Name",
            generic_name: "Generic Name",
            form: "Form",
            strength: "Strength",
            unit: "Unit",
            po_unit: "PO-unit",
            converstion_rate: "Conversion rate between unit and PO-unit",
          },
        ]}
        endpoint="/api/pharmacy_items/bulk_create"
        template_file_name="pharmacy_item_template.csv"
      />
    </>
  );
};

export default PharmacyItemForm;
