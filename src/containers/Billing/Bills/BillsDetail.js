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
                <Typography variant="body">Bill ID</Typography>
              </Box>
              <Typography variant="body">{bill?.id && bill?.id}</Typography>
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
                <Typography variant="body">Date</Typography>
              </Box>
              <Typography variant="body">
                {bill?.created_time && bill?.created_time.split("T")[0]}
              </Typography>
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
                <Typography variant="body">Patient ID</Typography>
              </Box>
              <Typography variant="body">
                {bill?.patient &&
                  generateID(bill?.patient.id, bill?.created_time)}
              </Typography>
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
                <Typography variant="body">Name</Typography>
              </Box>
              <Typography variant="body">{bill?.patient_name}</Typography>
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
                <Typography variant="body">Phone</Typography>
              </Box>
              <Typography variant="body">{bill?.patient_phone}</Typography>
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
                <Typography variant="body">Address</Typography>
              </Box>
              <Box sx={{ width: "70%" }}>
                <Typography variant="body">{bill?.patient_address}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box sx={{ my: "15px" }}>
          <TableContainer>
            <Table sx={{ minWidth: 380 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#EBEBEB" }}>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>UOM</TableCell>
                  <TableCell>SubTotal</TableCell>
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
                      <TableCell component="th" scope="row">
                        {index + 1}
                        {/* {generateID(row.id, row.created_time)} */}
                      </TableCell>
                      <TableCell>{row?.name}</TableCell>
                      <TableCell>{row?.price}</TableCell>
                      <TableCell>{row?.quantity}</TableCell>
                      <TableCell>{row?.uom}</TableCell>
                      <TableCell>{row?.subtotal}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ paddingBottom: "25px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body">Total : </Typography>
            <Typography variant="body">{bill?.total_amount}</Typography>
          </Box>
          <Divider sx={{ my: "6px" }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body">Deposit : </Typography>
            <Typography variant="body">
              {stage === "drafted"
                ? totalDeposit
                : payment?.total_deposit_amount}
            </Typography>
          </Box>
          <Divider sx={{ my: "6px" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body">Unpaid : </Typography>
            <Typography variant="body">
              {stage === "drafted"
                ? parseInt(bill?.total_amount) - totalDeposit
                : payment?.unpaid_amount}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default BillsDetail;
