import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton, CSVUploadDialog } from "../../../components";
import { useAxios } from "../../../hooks";

const InventoryItemForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    pharmacy_item: null,
    ssi: null,
  });
  // const [pharmacyItems, setPharmacyItems] = useState([]);
  const [SSI, setSSI] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const getPharmacyItemsAndSSI = async () => {
    const [ssi] = await Promise.all([
      // api.get("/api/pharmacy_items/"),
      api.get("/api/salesServiceItem/"),
    ]);
    if (ssi.status === 200) {
      // setPharmacyItems(pi.data);
      setSSI(ssi.data);
      if (id) getData();
    } else {
      history.goBack();
    }
  };

  const getData = async () => {
    const res = await api.get(`/api/inventory_items/${parseInt(id)}`);
    if (res.status === 200) {
      setDetails({ ...details, ...res.data });
    } else {
      history.goBack();
    }
  };

  const createNew = async () => {
    setLoading(true);
    const res = await api.post("/api/inventory_items/", {
      ...details,
      pharmacy_item_id: details?.pharmacy_item?.id,
      sales_service_item_id: details?.ssi?.id,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  const update = async () => {
    setLoading(true);
    const res = await api.put(`/api/inventory_items/${parseInt(id)}`, {
      ...details,
      pharmacy_item_id: details?.pharmacy_item?.id,
      sales_service_item_id: details?.ssi?.id,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  // useEffect(() => {
  //   if (details?.pharmacy_item_id && details?.id) {
  //     setDetails({
  //       ...details,
  //       pharmacy_item: pharmacyItems.find(
  //         (p) => p.id === details.pharmacy_item_id
  //       ),
  //     });
  //   }
  //   if (details?.sales_service_item_id && details?.id) {
  //     setDetails({
  //       ...details,
  //       ssi: SSI.find((s) => s.id === details.sales_service_item_id),
  //     });
  //   }
  //   // eslint-disable-next-line
  // }, [details?.pharmacy_item_id, details?.sales_service_item_id]);

  useEffect(() => {
    if (details?.sales_service_item_id && details?.id) {
      setDetails({
        ...details,
        ssi: SSI.find((s) => s.id === details.sales_service_item_id),
      });
    }
    // eslint-disable-next-line
  }, [details?.sales_service_item_id]);

  useEffect(() => {
    getPharmacyItemsAndSSI();
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
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">Pharmacy Item</Typography>
            </Box>
            <Autocomplete
              options={pharmacyItems}
              style={{ width: "70%" }}
              getOptionLabel={(option) => option.brand_name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              value={details.pharmacy_item}
              onChange={(e, value) => {
                setDetails({
                  ...details,
                  pharmacy_item: value,
                  name: value.brand_name,
                  unit: "",
                });
              }}
              renderOption={(props, option) => {
                return (
                  <Box {...props} key={option.id}>
                    {option.brand_name}
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
          </Box> */}
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
              value={details?.name || ""}
              name="name"
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
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.unit || ""}
              name="unit"
              onChange={handleChange}
            />
            {/* <TextField
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
              {details?.pharmacy_item?.po_unit && (
                <MenuItem value={details?.pharmacy_item?.po_unit}>
                  {details?.pharmacy_item?.po_unit}
                </MenuItem>
              )}
              {details?.pharmacy_item?.unit && (
                <MenuItem value={details?.pharmacy_item?.unit}>
                  {details?.pharmacy_item?.unit}
                </MenuItem>
              )}
            </TextField> */}
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
              <Typography variant="p">Sales Item</Typography>
            </Box>
            <Autocomplete
              options={SSI}
              style={{ width: "70%" }}
              getOptionLabel={(option) => option.name}
              value={details.ssi}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(e, value) => {
                setDetails({
                  ...details,
                  ssi: value,
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
          "pharmacy_item_id",
          "name",
          "balance",
          "unit",
          "purchasing_price",
          "sales_service_item_id",
          "expiry_date",
          "batch",
        ]}
        example_rows={[
          {
            pharmacy_item_id:
              "Please don't touch row 1 and look at row 3 for field description and example values. Columns with comma seperated values are the only valid value for those field. REMOVE ROW 2 AND 3 BEFORE UPLOADING.",
          },
          {
            pharmacy_item_id: "Pharmacy Item ID",
            name: "Inventory Item Name",
            balance: "Inventory Item Initial Balance",
            unit: "Pharmacy Item's PO-unit or unit (This is case sensitive)",
            purchasing_price: "Purchasing Price",
            sales_service_item_id: "Sales Service Item ID For Selling Price",
            expiry_date: "YYYY-MM-DD",
            batch: "Batch",
          },
        ]}
        endpoint="/api/inventory_items/bulk_create"
        template_file_name="inventory_item_template.csv"
      />
    </>
  );
};

export default InventoryItemForm;
