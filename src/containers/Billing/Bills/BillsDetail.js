import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useAxios } from "../../../hooks";
import { useState } from "react";
import { generateID } from "../../../utils/generateID";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { getComparator, stableSort } from "../../../utils/sorting";
import { BackButton } from "../../../components";
import { constants } from "../../../utils/constants";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  fontWeight: 1000,
}));

const StyledTableCell = styled(TableCell)(
  ({ theme, backgroundColor, maxWidth }) => ({
    backgroundColor: backgroundColor,
    fontSize: "1.2rem",
    fontWeight: 1000,
    wordWrap: "break-word",
    maxWidth: maxWidth,
  })
);

const BillsDetail = () => {
  const api = useAxios({ autoSnackbar: true });
  const apiNoSnackbar = useAxios({ autoSnackbar: false });
  const history = useHistory();
  const location = useLocation();
  const receiptRef = useRef();
  const { id, stage } = useParams();
  const [showPay, setShowPay] = useState(false);
  const [bill, setBill] = useState({});
  const [groupedBillItems, setGroupedBillItem] = useState([]);
  const [dispensedItems, setDispensedItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [payment, setPayment] = useState({});
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [open, setOpen] = useState(false);
  const [dateState, setDateState] = useState(new Date());
  const [isPrintMode, setIsPrintMode] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrint = useReactToPrint({
    pageStyle:
      "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}",
    content: () => receiptRef.current,
    onAfterPrint: () => {
      setIsPrintMode(false);
      // if (stage === "draft") {
      //   to_print();
      // }
    },
  });

  const cancelBill = async () => {
    if (bill) {
      const [b, inv] = await Promise.all([
        api.put(`/api/bill/cancel/${id}`),
        api.post("/api/inventory/returns", [...bill?.bill_items]),
      ]);
      if (b.status === 200 && inv.status === 200) {
        handleClose();
        history.goBack();
      }
    }
  };

  const getDepositByPatientId = async (id) => {
    const res = await api.get(`/api/deposit/active/${id}`);
    if (res.status === 200) {
      const total = res.data.reduce((total, num) => total + num.amount, 0);
      setTotalDeposit(total);
    }
  };

  const removeDuplicateObjectFromArray = (array, key) => {
    let check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };

  const group_bill_items = (billItems) => {
    const grouped_list = [];
    billItems.forEach((billItem) => {
      const same = billItems.filter((bi) => {
        return bi.name === billItem.name && bi.price === billItem.price;
      });
      let quantity = 0;
      let subtotal = 0;
      same.forEach((s) => {
        subtotal += s.subtotal;
        quantity += s.quantity;
      });
      grouped_list.push({ ...same[0], subtotal: subtotal, quantity: quantity });
    });
    const result = removeDuplicateObjectFromArray(grouped_list, "id");
    setGroupedBillItem(result);
  };

  const getBill = async () => {
    const res = await api.get(`/api/bill/${parseInt(id)}`);
    if (res.status === 200) {
      getDepositByPatientId(res.data.patient.id);
      setBill({ ...res.data });
      if (res.data.payment.length !== 0 && res.data.is_cancelled === false) {
        setPayment({ ...res.data.payment[0] });
        setShowPay(res.data.payment[0].is_outstanding);
      }
      group_bill_items(res.data.bill_items);
    } else {
      history.goBack();
    }
    return;
  };

  const get_dispensed_items = async () => {
    const res = await api.get(`/api/inventory/dispense/${id}`);
    if (res.status === 200) {
      setDispensedItems(res.data);
    }
  };

  const get_inventory_items = async () => {
    const res = await apiNoSnackbar.post("/api/inventory/", [
      ...bill?.bill_items,
    ]);
    if (res.status === 200) {
      setInventoryItems(res.data);
    }
  };

  const make_payment = async () => {
    if (bill) {
      const res = await api.put(`/api/payment/${parseInt(payment.id)}`);
      if (res.status === 200) {
        history.replace({
          pathname: `/dashboard/bills/details/${id}/completed`,
          state: {
            from: "bill_process",
          },
        });
      }
    }
    return;
  };

  const finalize = async () => {
    const res = await api.put(`/api/bill/print/${parseInt(id)}`);
    if (res.status === 200) {
      history.replace(`/dashboard/bills/details/${id}/outstanding`);
    }
    return;
  };

  const dispense_meds = async () => {
    if (bill) {
      const res = await api.post(`/api/inventory/dispense`, [
        ...bill?.bill_items,
      ]);
      if (res.status === 200) {
        get_dispensed_items();
      }
    }
    return;
  };

  const is_dispensed = (row) => {
    const is_invItem = inventoryItems.find(function (invItem) {
      if (row.sales_service_item_id === invItem.sales_service_item_id) {
        return true;
      }
      return false;
    });
    const is_dispensedItem = dispensedItems.find(function (dt) {
      if (parseInt(dt.note.split(",")[1]) === row.id) {
        return true;
      }
      return false;
    });
    if (!is_invItem) return true;
    else return is_invItem && is_dispensedItem;
  };

  const to_edit = () => {
    history.push(`/dashboard/bills/form/-${id}`);
  };

  useEffect(() => {
    if (isPrintMode) {
      handlePrint();
    }
    // eslint-disable-next-line
  }, [isPrintMode]);

  useEffect(() => {
    if (bill?.bill_items) {
      get_inventory_items();
    }
    // eslint-disable-next-line
  }, [bill?.bill_items]);

  useEffect(() => {
    const intervalId = setInterval(() => setDateState(new Date()), 30000);
    if (
      stage === "draft" ||
      stage === "outstanding" ||
      stage === "completed" ||
      stage === "cancelled"
    ) {
      getBill();
      get_dispensed_items();
    } else {
      history.goBack();
    }
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, [stage]);

  return (
    <>
      <Paper sx={{ width: "100%", mb: 1 }}>
        <Toolbar>
          <BackButton
            backFunction={() => {
              if (location.state?.from === "bill_process") {
                history.replace(`/dashboard/bills/form`);
              } else {
                history.goBack();
              }
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{ marginRight: "5px", display: showPay ? "block" : "none" }}
              onClick={make_payment}
            >
              Record Payment
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                marginRight: "5px",
                display: stage === "draft" ? "block" : "none",
              }}
              onClick={to_edit}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ marginRight: "5px" }}
              onClick={() => setIsPrintMode(true)}
            >
              Print
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                minWidth: "80px",
                marginRight: "5px",
                display:
                  stage === "draft" &&
                  inventoryItems.length === dispensedItems.length
                    ? "block"
                    : "none",
              }}
              onClick={finalize}
            >
              Finalize
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                minWidth: "140px",
                marginRight: "5px",
                display: stage === "draft" ? "block" : "none",
              }}
              disabled={inventoryItems.length === dispensedItems.length}
              onClick={dispense_meds}
            >
              {inventoryItems.length === dispensedItems.length
                ? "Meds Dispensed"
                : "Dispense Meds"}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              sx={{
                minWidth: "70px",
                marginRight: "5px",
                display:
                  stage === "draft" || stage === "outstanding"
                    ? "block"
                    : "none",
              }}
              onClick={() => setOpen(true)}
            >
              Cancel
            </Button>
          </Box>
        </Toolbar>
        <Container ref={receiptRef}>
          <Box sx={{ my: "15px" }}>
            <Typography variant="h6" textAlign="center">
              {constants.hospital_name}
            </Typography>
            <Box sx={{ flexDirection: "column", paddingTop: "15px" }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <StyledTypography variant="body">Bill ID</StyledTypography>
                </Box>
                <StyledTypography variant="body">
                  {bill?.id && generateID(bill?.id)}
                </StyledTypography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <StyledTypography variant="body">Date</StyledTypography>
                </Box>
                <StyledTypography variant="body">
                  {dateState.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </StyledTypography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <StyledTypography variant="body">Time</StyledTypography>
                </Box>
                <StyledTypography variant="body">
                  {dateState.toLocaleString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </StyledTypography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <StyledTypography variant="body">Patient ID</StyledTypography>
                </Box>
                <StyledTypography variant="body">
                  {bill?.patient &&
                    generateID(bill?.patient.id, bill?.patient.created_time)}
                </StyledTypography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <StyledTypography variant="body">Name</StyledTypography>
                </Box>
                <StyledTypography variant="body">
                  {bill?.patient_name}
                </StyledTypography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <StyledTypography variant="body">Phone</StyledTypography>
                </Box>
                <StyledTypography variant="body">
                  {bill?.patient_phone}
                </StyledTypography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  margin: "10px 0px",
                }}
              >
                <Box sx={{ width: "30%" }}>
                  <StyledTypography variant="body">Address</StyledTypography>
                </Box>
                <Box sx={{ width: "70%" }}>
                  <StyledTypography variant="body">
                    {bill?.patient_address}
                  </StyledTypography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ my: "15px", display: isPrintMode ? "none" : "block" }}>
            <TableContainer>
              <Table sx={{ minWidth: 380 }}>
                <TableHead
                  sx={{
                    backgroundColor: "#EBEBEB",
                    display: "table-row-group",
                  }}
                >
                  <TableRow>
                    <StyledTableCell maxWidth="75px">Date</StyledTableCell>
                    <StyledTableCell maxWidth="130px">Name</StyledTableCell>
                    <StyledTableCell maxWidth="75px" align="right">
                      Price
                    </StyledTableCell>
                    <StyledTableCell maxWidth="55px" align="right">
                      Qty
                    </StyledTableCell>
                    <StyledTableCell maxWidth="120px" align="right">
                      SubTotal
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bill?.bill_items &&
                    stableSort(bill.bill_items, getComparator("asc", "id")).map(
                      (row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <StyledTableCell maxWidth="75px">
                            {row?.created_time?.split("T")[0]}
                          </StyledTableCell>
                          <StyledTableCell
                            maxWidth="130px"
                            sx={{
                              color: is_dispensed(row) ? "black" : "gray",
                            }}
                          >
                            {row?.name}
                          </StyledTableCell>
                          <StyledTableCell maxWidth="75px" align="right">
                            {row?.price}
                          </StyledTableCell>
                          <StyledTableCell maxWidth="55px" align="right">
                            {row?.quantity}
                          </StyledTableCell>

                          <StyledTableCell maxWidth="120px" align="right">
                            {row?.subtotal}
                          </StyledTableCell>
                        </TableRow>
                      )
                    )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ my: "15px", display: isPrintMode ? "block" : "none" }}>
            <TableContainer>
              <Table sx={{ minWidth: 380 }}>
                <TableHead
                  sx={{
                    backgroundColor: "#EBEBEB",
                    display: "table-row-group",
                  }}
                >
                  <TableRow>
                    <StyledTableCell maxWidth="130px">Name</StyledTableCell>
                    <StyledTableCell maxWidth="75px" align="right">
                      Price
                    </StyledTableCell>
                    <StyledTableCell maxWidth="55px" align="right">
                      Qty
                    </StyledTableCell>
                    <StyledTableCell maxWidth="120px" align="right">
                      SubTotal
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedBillItems &&
                    stableSort(
                      groupedBillItems,
                      getComparator("asc", "id")
                    ).map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <StyledTableCell maxWidth="130px">
                          {row?.name}
                        </StyledTableCell>
                        <StyledTableCell maxWidth="75px" align="right">
                          {row?.price}
                        </StyledTableCell>
                        <StyledTableCell maxWidth="55px" align="right">
                          {row?.quantity}
                        </StyledTableCell>

                        <StyledTableCell maxWidth="120px" align="right">
                          {row?.subtotal}
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ paddingBottom: "25px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <StyledTypography variant="body">Total : </StyledTypography>
              <StyledTypography variant="body">
                {bill?.total_amount}
              </StyledTypography>
            </Box>
            <Divider sx={{ my: "6px" }} />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <StyledTypography variant="body">Deposit : </StyledTypography>
              <StyledTypography variant="body">
                {stage === "draft"
                  ? totalDeposit
                  : payment?.total_deposit_amount}
                {stage === "cancelled" && "0"}
              </StyledTypography>
            </Box>
            <Divider sx={{ my: "6px" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <StyledTypography variant="body">Unpaid : </StyledTypography>
              <StyledTypography variant="body">
                {stage === "draft"
                  ? parseInt(bill?.total_amount) - totalDeposit
                  : payment?.unpaid_amount}
                {stage === "cancelled" && bill?.total_amount}
              </StyledTypography>
            </Box>
            <Divider sx={{ my: "6px" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <StyledTypography variant="body">Created By : </StyledTypography>
              <StyledTypography variant="body">
                {bill?.created_user?.username}
              </StyledTypography>
            </Box>
          </Box>
        </Container>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel the bill?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={cancelBill} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BillsDetail;
