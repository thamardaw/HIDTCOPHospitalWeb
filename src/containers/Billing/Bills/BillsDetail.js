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
  fontWeight: 500,
}));

const StyledTableCell = styled(TableCell)(
  ({ theme, backgroundColor, maxWidth }) => ({
    backgroundColor: backgroundColor,
    fontSize: "1.2rem",
    fontWeight: 500,
    wordWrap: "break-word",
    maxWidth: maxWidth,
  })
);

const BillsDetail = () => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const location = useLocation();
  const receiptRef = useRef();
  const { id, stage } = useParams();
  const [showPay, setShowPay] = useState(false);
  const [bill, setBill] = useState({});
  const [payment, setPayment] = useState({});
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const cancelBill = async () => {
    await api.put(`/api/bill/cancel/${id}`);
    handleClose();
    history.goBack();
  };

  const handlePrint = useReactToPrint({
    pageStyle:
      "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}",
    content: () => receiptRef.current,
    onAfterPrint: () => {
      // if (stage === "draft") {
      //   to_print();
      // }
    },
  });

  const getDepositByPatientId = async (id) => {
    const res = await api.get(`/api/deposit/active/${id}`);
    if (res.status === 200) {
      const total = res.data.reduce((total, num) => total + num.amount, 0);
      setTotalDeposit(total);
    }
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
    } else {
      history.goBack();
    }
    return;
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

  const to_print = async () => {
    const res = await api.put(`/api/bill/print/${parseInt(id)}`);
    if (res.status === 200) {
      history.replace(`/dashboard/bills/details/${id}/outstanding`);
    }
    return;
  };

  // const formatAMPM = (date) => {
  //   let hours = date.getHours();
  //   let minutes = date.getMinutes();
  //   let ampm = hours >= 12 ? "pm" : "am";
  //   hours = hours % 12;
  //   hours = hours ? hours : 12;
  //   minutes = minutes.toString().padStart(2, "0");
  //   let strTime = hours + ":" + minutes + " " + ampm;
  //   return strTime;
  // };

  useEffect(() => {
    if (
      stage === "draft" ||
      stage === "outstanding" ||
      stage === "completed" ||
      stage === "cancelled"
    ) {
      getBill();
    } else {
      history.goBack();
    }
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
            sx={{ marginRight: "5px" }}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{
              marginRight: "5px",
              display: stage === "draft" ? "block" : "none",
            }}
            onClick={to_print}
          >
            Finalize
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{
              marginRight: "5px",
              display:
                stage === "draft" || stage === "outstanding" ? "block" : "none",
            }}
            onClick={() => setOpen(true)}
          >
            Cancel
          </Button>
        </Toolbar>
        <Container ref={receiptRef}>
          <Box sx={{ my: "15px" }}>
            <Typography variant="h6" textAlign="center">
              {constants.hospital_name}
            </Typography>
            {/* <Box sx={{ height: "15px" }} /> */}
            {/* <Typography variant="body" component="div">
            ID : {bill?.id && generateID(bill?.id, bill?.created_time)}
          </Typography>
          <Typography variant="body" component="div">
            Date : {bill?.created_time && bill?.created_time.split("T")[0]}
          </Typography>
          <Typography variant="body" component="div">
            Name : {bill?.patient_name}
          </Typography>
          <Typography variant="body" component="div">
            Phone : {bill?.patient_phone}
          </Typography>
          <Typography variant="body" component="div">
            Address : {bill?.patient_address}
          </Typography> */}
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
                  {bill?.created_time && bill?.created_time.split("T")[0]}
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
                  {bill?.created_time &&
                    new Date(bill.created_time).toLocaleTimeString("en-US", {
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
          <Box sx={{ my: "15px" }}>
            <TableContainer>
              <Table sx={{ minWidth: 380 }} aria-label="simple table">
                <TableHead
                  sx={{
                    backgroundColor: "#EBEBEB",
                    display: "table-row-group",
                  }}
                >
                  <TableRow>
                    {/* <StyledTableCell>No</StyledTableCell> */}
                    <StyledTableCell maxWidth="130px">Name</StyledTableCell>
                    <StyledTableCell maxWidth="75px" align="right">
                      Price
                    </StyledTableCell>
                    <StyledTableCell maxWidth="55px" align="right">
                      Qty
                    </StyledTableCell>
                    {/* <StyledTableCell>UOM</StyledTableCell> */}
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
                          {/* <StyledTableCell component="th" scope="row">
                          {index + 1}
                        </StyledTableCell> */}
                          <StyledTableCell maxWidth="130px">
                            {row?.name}
                          </StyledTableCell>
                          <StyledTableCell maxWidth="75px" align="right">
                            {row?.price}
                          </StyledTableCell>
                          <StyledTableCell maxWidth="55px" align="right">
                            {row?.quantity}
                          </StyledTableCell>
                          {/* <StyledTableCell>{row?.uom}</StyledTableCell> */}
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
