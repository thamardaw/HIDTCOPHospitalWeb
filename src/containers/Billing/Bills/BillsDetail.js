import {
  Button,
  Container,
  Divider,
  IconButton,
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
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useAxios } from "../../../hooks";
import { useState } from "react";
import { generateID } from "../../../utils/generateID";
import { styled } from "@mui/material/styles";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  fontWeight: 500,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: 500,
}));

const BillsDetail = () => {
  const api = useAxios();
  const history = useHistory();
  const receiptRef = useRef();
  const { id, stage } = useParams();
  const [showPay, setShowPay] = useState(false);
  const [bill, setBill] = useState({});
  const [payment, setPayment] = useState({});
  const [totalDeposit, setTotalDeposit] = useState(0);

  const handlePrint = useReactToPrint({
    pageStyle:
      "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}",
    content: () => receiptRef.current,
    onAfterPrint: () => {
      if (stage === "drafted") {
        to_print();
      }
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
      if (res.data.payment.length !== 0) {
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
        history.goBack();
      }
    }
    return;
  };

  const to_print = async () => {
    const res = await api.put(`/api/bill/print/${parseInt(id)}`);
    if (res.status === 200) {
      history.goBack();
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
    getBill();
    // eslint-disable-next-line
  }, []);

  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <Toolbar>
        <IconButton
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            borderRadius: "10%",
            "&:hover": {
              backgroundColor: "primary.light",
            },
            marginRight: "5px",
          }}
          onClick={() => history.goBack()}
          size="small"
        >
          <ArrowBackIosNewIcon size="small" sx={{ fontSize: "1.4rem" }} />
        </IconButton>
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
      </Toolbar>
      <Container ref={receiptRef}>
        <Box sx={{ my: "15px" }}>
          <Typography variant="h6" textAlign="center">
            Dagon Lin Hospital
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
                {bill?.id && bill?.id}
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
                  generateID(bill?.patient.id, bill?.created_time)}
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
              <TableHead sx={{ backgroundColor: "#EBEBEB" }}>
                <TableRow>
                  <StyledTableCell>No</StyledTableCell>
                  <StyledTableCell>Name</StyledTableCell>
                  <StyledTableCell>Price</StyledTableCell>
                  <StyledTableCell>Quantity</StyledTableCell>
                  <StyledTableCell>UOM</StyledTableCell>
                  <StyledTableCell>SubTotal</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bill?.bill_items &&
                  bill.bill_items.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {index + 1}
                        {/* {generateID(row.id, row.created_time)} */}
                      </StyledTableCell>
                      <StyledTableCell>{row?.name}</StyledTableCell>
                      <StyledTableCell>{row?.price}</StyledTableCell>
                      <StyledTableCell>{row?.quantity}</StyledTableCell>
                      <StyledTableCell>{row?.uom}</StyledTableCell>
                      <StyledTableCell>{row?.subtotal}</StyledTableCell>
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
              {stage === "drafted"
                ? totalDeposit
                : payment?.total_deposit_amount}
            </StyledTypography>
          </Box>
          <Divider sx={{ my: "6px" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <StyledTypography variant="body">Unpaid : </StyledTypography>
            <StyledTypography variant="body">
              {stage === "drafted"
                ? parseInt(bill?.total_amount) - totalDeposit
                : payment?.unpaid_amount}
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
  );
};

export default BillsDetail;
