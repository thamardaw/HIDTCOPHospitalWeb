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
import { useHistory, useParams } from "react-router-dom";
import { useAxios } from "../../../hooks";
import { useState, useEffect, useContext, useRef } from "react";
import { generateID } from "../../../utils/generateID";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import LoadingContext from "../../../contexts/LoadingContext";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { getComparator, stableSort } from "../../../utils/sorting";
import { BackButton } from "../../../components";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const BillsEditForm = () => {
  const history = useHistory();
  const api = useAxios();
  const { id } = useParams();
  const [details, setDetails] = useState([]);
  const [salesServiceItem, setSalesServiceItem] = useState([]);
  const [currentSSI, setCurrentSSI] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [loading, setLoading] = useState(false);
  const { setScreenLoading } = useContext(LoadingContext);
  const [editingItem, setEditingItem] = useState({
    id: 0,
    index: 0,
    quantity: 0,
    price: 0,
  });
  const quantityRef = useRef();
  const SSIRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleEdit = (event, index) => {
    setEditingItem({
      ...editingItem,
      index: index,
      id: details.bill_items[index].id,
      quantity: details.bill_items[index].quantity,
    });
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getSalesServiceItem = async () => {
    setScreenLoading(true);
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
      setScreenLoading(false);
    } else {
      history.goBack();
    }
    return;
    // eslint-disable-next-line
  };
  const getDepositByPatientId = async (id) => {
    const res = await api.get(`/api/deposit/active/${parseInt(id)}`);
    if (res.status === 200) {
      const total = res.data.reduce((total, num) => total + num.amount, 0);
      setTotalDeposit(total);
    }
  };

  const getData = async () => {
    const res = await api.get(`/api/bill/${parseInt(id.split("-")[1])}`);
    if (res.status === 200) {
      getDepositByPatientId(res.data.patient.id);
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
    return;
  };

  const updateItem = async () => {
    setLoading(true);
    const res = await api.put(
      `/api/bill/billItem/${editingItem.id}/?quantity=${editingItem.quantity}`
    );
    if (res.status === 200) {
      handleClose();
      getData();
    }
    setLoading(false);
  };

  const addItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.post(
      `/api/bill/${parseInt(id.split("-")[1])}/billItem/`,
      {
        ...currentSSI,
        sales_service_item_id: parseInt(currentSSI.sales_service_item_id),
        quantity: parseInt(currentQuantity),
        remark: "",
      }
    );
    if (res.status === 200) {
      getData();
    }
    setLoading(false);
    SSIRef.current.focus();
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
    <>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <Toolbar>
          <BackButton backFunction={() => history.goBack()} />
          <Typography
            variant="h6"
            component="div"
            //   sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            Edit Bill
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
                <Typography variant="p" fontWeight={500}>
                  Patient Name
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
                    generateID(
                      details?.patient_id,
                      details?.patient.created_time
                    )}
                </Typography>
              </Box>
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
                <Typography variant="body2">
                  {details?.patient_phone}
                </Typography>
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
          </Box> */}
        </Container>
        <Container sx={{ paddingBottom: "20px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "column", md: "row" },
              alignItems: "flex-end",
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
                    <LoadingButton
                      loading={loading}
                      variant="contained"
                      type="submit"
                    >
                      ADD
                    </LoadingButton>
                  </Box>
                </form>
              </Box>
              <Box sx={{ paddingTop: "10px" }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => history.goBack()}
                >
                  Save Bill
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
                  <Typography variant="body">
                    :{" "}
                    {details?.patient_id &&
                      generateID(
                        details?.patient_id,
                        details?.patient.created_time
                      )}
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
                    <Typography variant="body">Patient Name</Typography>
                  </Box>
                  <Typography variant="body">
                    : {details?.patient_name}
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
                    : {details?.patient_phone}
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
                    : {details?.patient_address}
                  </Typography>
                </Box>
              </Container>
              <Container sx={{ paddingTop: "10px" }}>
                <TableContainer sx={{ maxHeight: 220 }}>
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
                      {details?.bill_items &&
                        stableSort(
                          details.bill_items,
                          getComparator("desc", "id")
                        ).map((row, index) => (
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
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <IconButton
                                  aria-label="edit"
                                  color="primary"
                                  onClick={(e) => handleEdit(e, index)}
                                  sx={{
                                    padding: "0px",
                                    margin: "0px",
                                    marginRight: "5px",
                                  }}
                                >
                                  <ModeEditIcon />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  color="error"
                                  onClick={() => removeItem(row.id)}
                                  sx={{ padding: "0px", margin: "0px" }}
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
                {/* <Box
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
                    Deposit : {totalDeposit}MMK
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                  >
                    Total : {details?.total_amount}MMK
                  </Typography>
                </Box> */}

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
                    {details?.total_amount}MMK
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
                    {details?.total_amount &&
                      details?.total_amount - totalDeposit}
                    MMK
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
          <LoadingButton
            loading={loading}
            variant="contained"
            size="small"
            onClick={updateItem}
            fullWidth
          >
            Save
          </LoadingButton>
        </MenuItem>
      </Menu>
    </>
  );
};

export default BillsEditForm;
