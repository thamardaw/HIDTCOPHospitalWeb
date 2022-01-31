import {
  Autocomplete,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
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
import { useState, useEffect, useContext, useRef } from "react";
import { generateID } from "../../../utils/generateID";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingContext from "../../../contexts/LoadingContext";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

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
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState({
    index: 0,
    quantity: 0,
    price: 0,
  });
  const { setScreenLoading } = useContext(LoadingContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const quantityRef = useRef();
  const SSIRef = useRef();

  const handleEdit = (event, index) => {
    // console.log((billItems[index].quantity = 10));
    // setBillItems([...billItems]);
    // console.log(billItems[index]);
    setEditingItem({
      ...editingItem,
      index: index,
      quantity: billItems[index].quantity,
    });
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const updateItem = () => {
    billItems[editingItem.index].quantity = editingItem.quantity;
    setBillItems([...billItems]);
    handleClose();
    setEditingItem({
      index: 0,
      quantity: 0,
      price: 0,
    });
  };

  const getPatientAndSalesServiceItem = async () => {
    setScreenLoading(true);
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
          uom: row.uom?.name,
        };
      });
      setSalesServiceItem(s);
      setScreenLoading(false);
    } else {
      history.goBack();
    }
  };

  const getDepositByPatientId = async (id) => {
    const res = await api.get(`/api/deposit/active/${id.split("-")[1]}`);
    if (res.status === 200) {
      const total = res.data.reduce((total, num) => total + num.amount, 0);
      setTotalDeposit(total);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    billItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
  };

  const addItem = (e) => {
    e.preventDefault();
    if (currentSSI) {
      billItems.unshift({
        ...currentSSI,
        quantity: parseInt(currentQuantity),
        remark: "",
      });
      setCurrentSSI(null);
      setCurrentQuantity(0);
      calculateTotal();
      SSIRef.current.focus();
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
      setLoading(true);
      const res = await api.post(`/api/bill/`, {
        patient_id: parseInt(currentPatient.id.split("-")[1]),
        patient_name: currentPatient.name,
        patient_phone: currentPatient.contactDetails,
        patient_address: currentPatient.address,
        bill_items: billItems,
      });
      if (res.status === 200) {
        history.replace(`/dashboard/bills/details/${res.data.id}/draft`);
      }
      setLoading(false);
    }
    return;
  };

  return (
    <>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            //   sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            New Bill
          </Typography>
        </Toolbar>
        <Container>
          {/* <Box
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
                <Typography variant="p">Select Patient</Typography>
              </Box>
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
                  getOptionLabel={(option) => `${option.name}, ${option.id}`}
                  renderOption={(props, option) => {
                    return (
                      <Box {...props} key={option.id}>
                        {option.name}, {option.id}
                      </Box>
                    );
                  }}
                  style={{ width: "80%" }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      getDepositByPatientId(newValue.id);
                    } else {
                      setTotalDeposit(0);
                    }
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
              <Autocomplete
                value={currentPatient}
                options={patient}
                getOptionLabel={(option) => option.id}
                style={{ width: "90%" }}
                onChange={(event, newValue) => {
                  if (newValue) {
                    getDepositByPatientId(newValue.id);
                  } else {
                    setTotalDeposit(0);
                  }
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
          </Box> */}
          {/* <Box
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
          </Box> */}
        </Container>
        <Container sx={{ paddingBottom: "20px" }}>
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
                    <Typography variant="p">Select Patient</Typography>
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
                      getOptionLabel={(option) =>
                        `${option.name}, ${option.id}`
                      }
                      renderOption={(props, option) => {
                        return (
                          <Box {...props} key={option.id}>
                            {option.name}, {option.id}
                          </Box>
                        );
                      }}
                      style={{ width: "90%" }}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          getDepositByPatientId(newValue.id);
                        } else {
                          setTotalDeposit(0);
                        }
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
                <Divider sx={{ margin: "15px 0px" }} />
                <form onSubmit={addItem}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Box sx={{ width: "100%" }}>
                      <Typography variant="p">
                        Select Sales & Service Item
                      </Typography>
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
                      inputRef={quantityRef}
                      size="small"
                      fullWidth
                      margin="normal"
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
                    <Button variant="contained" type="submit">
                      ADD
                    </Button>
                  </Box>
                </form>
              </Box>
              <Box sx={{ paddingTop: "10px" }}>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  fullWidth
                  onClick={createBill}
                >
                  save Bill
                </LoadingButton>
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
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Box sx={{ width: "30%" }}>
                    <Typography variant="body">Patient ID</Typography>
                  </Box>
                  <Typography variant="body">: {currentPatient?.id}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    margin: "5px 0px",
                  }}
                >
                  <Box sx={{ width: "30%" }}>
                    <Typography variant="body">Patient Name</Typography>
                  </Box>
                  <Typography variant="body">
                    : {currentPatient?.name}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    margin: "5px 0px",
                  }}
                >
                  <Box sx={{ width: "30%" }}>
                    <Typography variant="body">Patient Phone</Typography>
                  </Box>
                  <Typography variant="body">
                    : {currentPatient?.contactDetails}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    margin: "5px 0px",
                  }}
                >
                  <Box sx={{ width: "30%" }}>
                    <Typography variant="body">Patient Address</Typography>
                  </Box>
                  <Typography variant="body">
                    : {currentPatient?.address}
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
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>No</StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell align="right">Price</StyledTableCell>
                        <StyledTableCell align="right">
                          Quantity
                        </StyledTableCell>
                        <StyledTableCell align="right">UOM</StyledTableCell>
                        <StyledTableCell align="right">
                          SubTotal
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          Actions
                        </StyledTableCell>
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
                          <TableCell align="center">
                            <Box sx={{ display: "flex" }}>
                              <IconButton
                                aria-label="edit"
                                color="primary"
                                onClick={(e) => handleEdit(e, index)}
                              >
                                <ModeEditIcon />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                color="error"
                                onClick={() => removeItem(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Container>
              <Container sx={{ paddingTop: { xs: "20px", sm: "5px" } }}>
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
                    Deposit :
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    {totalDeposit}MMK
                  </Typography>
                </Box>
                <Divider />
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
                    Total :
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    {totalAmount}MMK
                  </Typography>
                </Box>
                <Divider />
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
                    Unpaid :
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    {totalAmount - totalDeposit}MMK
                  </Typography>
                </Box>
              </Container>
            </Box>
          </Box>
        </Container>
      </Paper>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <TextField
            label="Quantity"
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            size="small"
            sx={{ width: "120px" }}
            value={editingItem.quantity}
            onChange={(e) =>
              setEditingItem({ ...editingItem, quantity: e.target.value })
            }
          />
        </MenuItem>
        <MenuItem>
          <Button
            variant="contained"
            size="small"
            onClick={updateItem}
            fullWidth
          >
            Save
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};

export default BillsForm;
