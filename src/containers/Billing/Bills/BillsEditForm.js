import {
  Autocomplete,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router-dom";
import { useAxios } from "../../../hooks";
import { useState, useEffect } from "react";
import { generateID } from "../../../utils/generateID";

const BillsEditForm = () => {
  const history = useHistory();
  const api = useAxios();
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [salesServiceItem, setSalesServiceItem] = useState([]);
  const [currentSSI, setCurrentSSI] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);

  const getSalesServiceItem = async () => {
    const res = await api.get("/api/salesServiceItem/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        return {
          sales_service_item_id: ID,
          name: row.name,
          price: row.price,
          uom: row.uom.name,
        };
      });
      setSalesServiceItem(data);
    } else {
      history.goBack();
    }
    return;
    // eslint-disable-next-line
  };

  const getData = async () => {
    const res = await api.get(`/api/bill/${parseInt(id.split("-")[1])}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
    return;
  };

  const addItem = async () => {
    const res = await api.post(
      `/api/bill/${parseInt(id.split("-")[1])}/billItem/`,
      {
        ...currentSSI,
        sales_service_item_id: parseInt(
          currentSSI.sales_service_item_id.split("-")[1]
        ),
        quantity: parseInt(currentQuantity),
        remark: "",
      }
    );
    if (res.status === 200) {
      getData();
    }
  };

  const removeItem = async (itemId) => {
    const res = await api.delete(
      `/api/bill/${parseInt(id.split("-")[1])}/billItem/${itemId}`
    );
    if (res.status === 200) {
      getData();
    }
  };

  useEffect(() => {
    getSalesServiceItem();
    getData();
    // eslint-disable-next-line
  }, [id]);

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          //   sx={{ fontSize: { xs: "14px", sm: "16px" } }}
        >
          Patient Info
        </Typography>
      </Toolbar>
      <Container>
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
        >
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p" fontWeight={500}>
                Patient Name
              </Typography>
            </Box>
            {/* <TextField size="small" sx={{ width: "90%" }} margin="normal" /> */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                margin: "20px 0px",
              }}
            >
              <Typography variant="body2">{details?.patient_name}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p" fontWeight={500}>
                Pateint ID
              </Typography>
            </Box>
            {/* <TextField size="small" sx={{ width: "90%" }} margin="normal" /> */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                margin: "20px 0px",
              }}
            >
              <Typography variant="body2">
                {details?.patient_id &&
                  generateID(details?.patient_id, details?.created_time)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
        >
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p" fontWeight={500}>
                Phone
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                margin: "20px 0px",
              }}
            >
              <Typography variant="body2">{details?.patient_phone}</Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p" fontWeight={500}>
                Address
              </Typography>
            </Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                margin: "20px 0px",
              }}
            >
              <Typography variant="body2">
                {details?.patient_address}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
      <Container sx={{ padding: "20px 0px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "35%" },
            }}
          >
            <Box
              sx={{
                padding: "14px",
                width: "100%",
                border: "2px solid lightgray",
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="p">Sales & Service Item</Typography>
                </Box>
                {/* <TextField size="small" fullWidth margin="dense" />
                 */}
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
                  <IconButton
                    size="small"
                    color="primary"
                    sx={{ marginTop: "5px" }}
                    onClick={() =>
                      history.push("/dashboard/salesServiceItem/form")
                    }
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
                <TextField
                  size="small"
                  fullWidth
                  margin="dense"
                  type="number"
                  InputProps={{
                    inputProps: { min: "0", step: "1" },
                  }}
                  value={currentQuantity}
                  onChange={(e) => setCurrentQuantity(e.target.value)}
                />
              </Box>
              <Box
                sx={{
                  paddingTop: "10px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="contained" onClick={addItem}>
                  ADD
                </Button>
              </Box>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => history.goBack()}
              >
                Done
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "65%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Container sx={{ paddingTop: { xs: "20px", sm: "0px" } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Bill Items
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Total : {details?.total_amount}MMK
                </Typography>
              </Box>
            </Container>
            <Container sx={{ paddingTop: "10px" }}>
              <TableContainer sx={{ maxHeight: 260 }}>
                <Table
                  sx={{ minWidth: 380 }}
                  aria-label="simple table"
                  size="small"
                  stickyHeader
                >
                  <TableHead sx={{ backgroundColor: "#EBEBEB" }}>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">UOM</TableCell>
                      <TableCell align="right">SubTotal</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {details?.bill_items &&
                      details?.bill_items.map((row, index) => (
                        <TableRow
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {index + 1}
                          </TableCell>
                          <TableCell>{row?.name}</TableCell>
                          <TableCell align="right">{row?.price}</TableCell>
                          <TableCell align="right">{row?.quantity}</TableCell>
                          <TableCell align="right">{row?.uom}</TableCell>
                          <TableCell align="right">{row?.subtotal}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              aria-label="delete"
                              color="error"
                              onClick={() => removeItem(row.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default BillsEditForm;
