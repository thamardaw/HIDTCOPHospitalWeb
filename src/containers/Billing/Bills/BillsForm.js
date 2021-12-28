import {
  Autocomplete,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
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
import { useHistory } from "react-router-dom";
import { useAxios } from "../../../hooks";
import { useState, useEffect } from "react";
import { generateID } from "../../../utils/generateID";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const BillsForm = () => {
  const history = useHistory();
  const api = useAxios();
  const [patient, setPatient] = useState([]);
  const [salesServiceItem, setSalesServiceItem] = useState([]);
  const [currentPatient, setCurrectPatient] = useState(null);
  const [currentSSI, setCurrentSSI] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const getPatientAndSalesServiceItem = async () => {
    const [patient, salesServiceItem] = await Promise.all([
      api.get("/api/patients/"),
      api.get("/api/salesServiceItem/"),
    ]);
    if (patient.status === 200 && salesServiceItem.status === 200) {
      const p = patient.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        return {
          id: ID,
          name: row.name,
          age: row.age.toString(),
          contactDetails: row.contact_details,
          gender: row.gender,
          dataOfBirth: row.date_of_birth,
          address: row.address,
        };
      });
      setPatient(p);
      const s = salesServiceItem.data.map((row) => {
        return {
          sales_service_item_id: row.id,
          name: row.name,
          price: row.price,
          uom: row.uom.name,
        };
      });
      setSalesServiceItem(s);
    } else {
      history.goBack();
    }
  };

  const calculateTotal = () => {
    let total = 0;
    billItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
  };

  const addItem = () => {
    if (currentSSI) {
      billItems.push({
        ...currentSSI,
        quantity: parseInt(currentQuantity),
        remark: "",
      });
      setCurrentSSI(null);
      setCurrentQuantity(0);
      calculateTotal();
    }
  };

  const removeItem = (i) => {
    billItems.splice(i, 1);
    setBillItems([...billItems]);
    calculateTotal();
  };

  useEffect(() => {
    getPatientAndSalesServiceItem();
    // eslint-disable-next-line
  }, []);

  const createBill = async () => {
    if (currentPatient) {
      const res = await api.post(`/api/bill/`, {
        patient_id: parseInt(currentPatient.id.split("-")[1]),
        bill_items: billItems,
      });
      if (res.status === 200) {
        history.goBack();
      }
    }
    return;
  };

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          //   sx={{ fontSize: { xs: "14px", sm: "16px" } }}
        >
          Patient Information
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
              <Typography variant="p">Patient Name</Typography>
            </Box>
            {/* <TextField size="small" sx={{ width: "90%" }} margin="normal" /> */}
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Autocomplete
                value={currentPatient}
                options={patient}
                getOptionLabel={(option) => option.name}
                renderOption={(props, option) => {
                  return (
                    <Box {...props} key={option.id}>
                      {option.name}
                    </Box>
                  );
                }}
                style={{ width: "80%" }}
                onChange={(event, newValue) => {
                  setCurrectPatient(newValue);
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
                onClick={() => history.push("/dashboard/patient/form")}
              >
                <AddIcon fontSize="large" />
              </IconButton>
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
              <Typography variant="p">Pateint ID</Typography>
            </Box>
            {/* <TextField size="small" sx={{ width: "90%" }} margin="normal" /> */}
            <Autocomplete
              value={currentPatient}
              options={patient}
              getOptionLabel={(option) => option.id}
              style={{ width: "90%" }}
              onChange={(event, newValue) => {
                setCurrectPatient(newValue);
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
              <Typography variant="p">Phone</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "90%" }}
              margin="normal"
              disabled
              value={currentPatient ? currentPatient?.contactDetails : ""}
            />
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
              <Typography variant="p">Address</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "90%" }}
              margin="normal"
              disabled
              value={currentPatient ? currentPatient?.address : ""}
            />
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
              <Button variant="contained" fullWidth onClick={createBill}>
                Create Bill
              </Button>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => history.goBack()}
              >
                Cancel
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
                  Total : {totalAmount}MMK
                </Typography>
              </Box>
            </Container>
            <Container sx={{ paddingTop: "10px" }}>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table
                  sx={{ minWidth: 380 }}
                  aria-label="simple table"
                  size="small"
                  stickyHeader
                >
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>No</StyledTableCell>
                      <StyledTableCell>Name</StyledTableCell>
                      <StyledTableCell align="right">Price</StyledTableCell>
                      <StyledTableCell align="right">Quantity</StyledTableCell>
                      <StyledTableCell align="right">UOM</StyledTableCell>
                      <StyledTableCell align="right">SubTotal</StyledTableCell>
                      <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billItems.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{row.uom}</TableCell>
                        <TableCell align="right">
                          {row.price * row.quantity}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => removeItem(index)}
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

export default BillsForm;
