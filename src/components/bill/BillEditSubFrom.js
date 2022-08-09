import {
  Autocomplete,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import { useHistory } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAxios } from "../../hooks";

const BillEditSubForm = ({ id, getData }) => {
  const history = useHistory();
  const api = useAxios({ autoSnackbar: true });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [salesServiceItem, setSalesServiceItem] = useState([]);
  const [currentSSI, setCurrentSSI] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const quantityRef = useRef();
  const SSIRef = useRef();

  const addItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.post(`/api/bill/${id}/billItem/`, {
      ...currentSSI,
      sales_service_item_id: parseInt(currentSSI.sales_service_item_id),
      quantity: parseInt(currentQuantity),
      remark: "",
    });
    if (res.status === 200) {
      getData();
      setCurrentSSI(null);
      setCurrentQuantity(0);
    }
    setLoading(false);
    SSIRef.current.focus();
  };

  const getSalesServiceItem = async () => {
    setDataLoading(true);
    // await sleep(1e3);
    const res = await api.get("/api/salesServiceItem/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        return {
          sales_service_item_id: row.id,
          name: row.name,
          price: row.price,
          uom: row.uom?.name,
        };
      });
      setSalesServiceItem(data);
      setDataLoading(false);
    } else {
      history.goBack();
    }
    return;
    // eslint-disable-next-line
  };

  useEffect(() => {
    getSalesServiceItem();
    // eslint-disable-next-line
  }, []);

  if (dataLoading)
    return (
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <form onSubmit={addItem}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p">Select Sales & Service Item</Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Autocomplete
                value={currentSSI}
                options={salesServiceItem}
                style={{ width: "90%" }}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => {
                  return (
                    <Box {...props} key={option.sales_service_item_id}>
                      {option.name}
                    </Box>
                  );
                }}
                onChange={(event, newValue) => {
                  setCurrentSSI(newValue);
                  quantityRef.current.focus();
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputRef={SSIRef}
                    variant="outlined"
                    fullWidth
                    size="small"
                    margin="normal"
                  />
                )}
              />
              <IconButton
                size="small"
                color="primary"
                sx={{ marginTop: "5px" }}
                onClick={() => history.push("/dashboard/salesServiceItem/form")}
              >
                <AddIcon fontSize="large" />
              </IconButton>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p">Quantity</Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                inputRef={quantityRef}
                size="small"
                style={{ width: "85%" }}
                margin="normal"
                type="number"
                InputProps={{
                  inputProps: { min: "0", step: "1" },
                }}
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
              />
              <Box sx={{ width: "45px" }}></Box>
            </Box>
          </Box>
          <Box
            sx={{
              paddingTop: "10px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <LoadingButton loading={loading} variant="contained" type="submit">
              ADD
            </LoadingButton>
          </Box>
        </form>
      </Box>
      <Box sx={{ paddingTop: "10px" }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() =>
            history.replace(`/dashboard/bills/details/${id}/draft`)
          }
        >
          Save Bill
        </Button>
      </Box>
    </>
  );
};

export default BillEditSubForm;
