import {
  Autocomplete,
  Badge,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router-dom";
import { useAxios } from "../../../hooks";
import { useState, useEffect, useRef } from "react";
import { generateID } from "../../../utils/generateID";
import { styled } from "@mui/material/styles";
import LoadingButton from "@mui/lab/LoadingButton";
import { getComparator, stableSort } from "../../../utils/sorting";
import { BackButton, BillItemsTableRow } from "../../../components";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const BillsEditForm = () => {
  const history = useHistory();
  const api = useAxios({ autoSnackbar: true });
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const [billItems, setBillItems] = useState([]);
  const [dispensedItems, setDispensedItems] = useState([]);
  const [salesServiceItem, setSalesServiceItem] = useState([]);
  const [currentSSI, setCurrentSSI] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const quantityRef = useRef();
  const SSIRef = useRef();
  const [filter, setFilter] = useState({
    date: "",
    name: "",
  });
  const [dateFilterAnchorEl, setDateFilterAnchorEl] = useState(null);
  const [nameFilterAnchorEl, setNameFilterAnchorEl] = useState(null);
  const dateFilterOpen = Boolean(dateFilterAnchorEl);
  const nameFilterOpen = Boolean(nameFilterAnchorEl);

  const resetFilter = () => {
    setFilter({ date: "", name: "" });
  };

  const isDispensed = (row) => {
    return Boolean(
      dispensedItems.find(function (dt, index) {
        if (parseInt(dt.note.split(",")[1]) === row.id) {
          return true;
        }
        return false;
      })
    );
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
  const getDepositByPatientId = async (id) => {
    const res = await api.get(`/api/deposit/active/${parseInt(id)}`);
    if (res.status === 200) {
      const total = res.data.reduce((total, num) => total + num.amount, 0);
      setTotalDeposit(total);
    }
  };

  const getData = async () => {
    const [bill, invtxs] = await Promise.all([
      api.get(`/api/bill/${id}`),
      api.get(`/api/inventory/dispense/${id}`),
    ]);
    if (bill.status === 200 && invtxs.status === 200) {
      getDepositByPatientId(bill.data.patient.id);
      setDetails({
        ...bill.data,
        bill_items: stableSort(
          bill.data.bill_items,
          getComparator("desc", "id")
        ),
      });
      setBillItems(
        stableSort(bill.data.bill_items, getComparator("desc", "id"))
      );
      setDispensedItems(invtxs.data);
    } else {
      history.goBack();
    }
    return;
  };

  const updateItem = async (index, row, data) => {
    const res = await api.put(
      `/api/bill/billItem/${row.id}/?quantity=${data.quantity}`
    );
    if (res.status === 200) {
      getData();
    }
  };

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
      resetFilter();
      setCurrentSSI(null);
      setCurrentQuantity(0);
    }
    setLoading(false);
    SSIRef.current.focus();
  };

  const removeItem = async (index, row) => {
    const [item, invtx] = await Promise.all([
      api.delete(`/api/bill/${id}/billItem/${row.id}`),
      api.post(`/api/inventory/return`, { ...row }),
    ]);
    if (item.status === 200 && invtx.status === 200) {
      getData();
      resetFilter();
    }
  };

  useEffect(() => {
    const date = filter.date.toLowerCase();
    const name = filter.name.toLowerCase();
    if (date === "" && name === "") {
      setDetails({
        ...details,
        bill_items: billItems,
      });
      return;
    }
    const v = billItems.filter((value) => {
      return (
        (date === "" ||
          value["created_time"].toString().toLowerCase().includes(date)) &&
        (name === "" || value["name"].toString().toLowerCase().includes(name))
      );
    });
    setDetails({
      ...details,
      bill_items: v,
    });
    // eslint-disable-next-line
  }, [filter]);

  useEffect(() => {
    getSalesServiceItem();
    getData();
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          paddingLeft: "12px",
        }}
        variant="dense"
        disableGutters={true}
      >
        <BackButton backFunction={() => history.goBack()} />
        <Typography variant="h6" component="div">
          Edit Bill
        </Typography>
      </Toolbar>
      <Divider />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          alignItems: "flex-start",
          padding: "20px 10px",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
          }}
        >
          {dataLoading ? (
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
          ) : (
            <>
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
                  onClick={() =>
                    history.replace(`/dashboard/bills/details/${id}/draft`)
                  }
                >
                  Save Bill
                </Button>
              </Box>
            </>
          )}
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
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Bill ID
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              >
                {generateID(parseInt(id))}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Patient ID
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              >
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
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Name
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              >
                {details?.patient_name}
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
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Phone
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              >
                {details?.patient_phone}
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
                <Typography
                  variant="h6"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Address
                </Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              >
                {details?.patient_address}
              </Typography>
            </Box>
          </Container>
          <Container sx={{ paddingTop: "10px" }}>
            <TableContainer sx={{ maxHeight: 220 }}>
              <Table
                sx={{ minWidth: 500 }}
                aria-label="simple table"
                size="small"
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ minWidth: "16px" }}>
                      No
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: "80px",
                        }}
                      >
                        Date
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            setDateFilterAnchorEl(event.currentTarget);
                          }}
                        >
                          <Badge
                            variant="dot"
                            invisible={filter.date === ""}
                            color="primary"
                          >
                            <FilterAltIcon fontSize="small" />
                          </Badge>
                        </IconButton>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: "120px",
                        }}
                      >
                        Name
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            setNameFilterAnchorEl(event.currentTarget);
                          }}
                        >
                          <Badge
                            variant="dot"
                            invisible={filter.name === ""}
                            color="primary"
                          >
                            <FilterAltIcon fontSize="small" />
                          </Badge>
                        </IconButton>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: "24px" }}>
                      Price
                    </StyledTableCell>
                    <StyledTableCell padding="none" sx={{ minWidth: "80px" }}>
                      Qty
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: "24px" }}>
                      UOM
                    </StyledTableCell>
                    <Tooltip
                      title={
                        details?.bill_items &&
                        details.bill_items.reduce(
                          (total, num) => total + num.subtotal,
                          0
                        )
                      }
                      arrow
                      placement="top"
                    >
                      <StyledTableCell sx={{ minWidth: "32px" }}>
                        SubTotal
                      </StyledTableCell>
                    </Tooltip>
                    <StyledTableCell align="center" sx={{ minWidth: "32px" }}>
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details?.bill_items &&
                    details.bill_items.map((row, index) => (
                      // <TableRow
                      //   key={row.id}
                      //   sx={{
                      //     "&:last-child td, &:last-child th": { border: 0 },
                      //   }}
                      // >
                      //   <TableCell component="th" scope="row">
                      //     {index + 1}
                      //   </TableCell>
                      //   <TableCell>{row?.created_time.split("T")[0]}</TableCell>
                      //   <TableCell>{row?.name}</TableCell>
                      //   <TableCell align="right">{row?.price}</TableCell>
                      //   <TableCell align="right">{row?.quantity}</TableCell>
                      //   <TableCell align="right">{row?.uom}</TableCell>
                      //   <TableCell align="right">{row?.subtotal}</TableCell>
                      //   <TableCell align="center">
                      //     <Box
                      //       sx={{
                      //         display: "flex",
                      //         alignItems: "center",
                      //         justifyContent: "center",
                      //       }}
                      //     >
                      //       <IconButton
                      //         aria-label="edit"
                      //         color="primary"
                      //         onClick={(e) => handleEdit(e, row)}
                      //         sx={{
                      //           padding: "0px",
                      //           margin: "0px",
                      //           marginRight: "5px",
                      //           display: dispensedItems.find(function (
                      //             dt,
                      //             index
                      //           ) {
                      //             if (
                      //               parseInt(dt.note.split(",")[1]) === row.id
                      //             ) {
                      //               return true;
                      //             }
                      //             return false;
                      //           })
                      //             ? "none"
                      //             : "span",
                      //         }}
                      //       >
                      //         <ModeEditIcon />
                      //       </IconButton>
                      //       <IconButton
                      //         aria-label="delete"
                      //         color="error"
                      //         onClick={() => removeItem(row)}
                      //         sx={{ padding: "0px", margin: "0px" }}
                      //       >
                      //         <DeleteIcon />
                      //       </IconButton>
                      //     </Box>
                      //   </TableCell>
                      // </TableRow>
                      <BillItemsTableRow
                        key={index}
                        isEditable={!isDispensed(row)}
                        index={index}
                        row={row}
                        onEdit={updateItem}
                        onDelete={removeItem}
                      />
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
                Total
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              >
                {details?.total_amount}
              </Typography>
            </Box>
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
                Deposit
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              >
                {totalDeposit}
              </Typography>
            </Box>
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
                Unpaid
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontSize: { xs: "14px", sm: "16px" } }}
              >
                {details?.total_amount && details?.total_amount - totalDeposit}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
      <Menu
        anchorEl={dateFilterAnchorEl}
        open={dateFilterOpen}
        onClose={() => setDateFilterAnchorEl(null)}
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
            label="Date"
            placeholder="YYYY-MM-DD"
            size="small"
            sx={{ width: "120px" }}
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={nameFilterAnchorEl}
        open={nameFilterOpen}
        onClose={() => setNameFilterAnchorEl(null)}
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
            label="Name"
            size="small"
            sx={{ width: "120px" }}
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default BillsEditForm;
