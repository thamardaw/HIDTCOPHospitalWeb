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

const PaymentDetail = () => {
  const api = useAxios();
  const history = useHistory();
  const receiptRef = useRef();
  const { id, stage } = useParams();
  const [showPay, setShowPay] = useState(true);
  const [details, setDetails] = useState({});

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    onAfterPrint: () => {
      to_print();
    },
  });

  const getData = async () => {
    const res = await api.get(`/api/bill/${parseInt(id.split("-")[1])}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
      console.log(res.data);
    } else {
      history.goBack();
    }
    return;
  };

  const make_payment = async () => {
    const res = await api.put(`/api/payment/${parseInt(id.split("-")[1])}`);
    if (res.status === 200) {
      history.goBack();
    }
    return;
  };

  const to_print = async () => {
    const res = await api.put(`/api/bill/print/${parseInt(id.split("-")[1])}`);
    if (res.status === 200) {
      history.goBack();
    }
    return;
  };

  useEffect(() => {
    if (stage) {
      setShowPay(false);
    }
    getData();
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
          Pay
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
          <Box sx={{ height: "15px" }} />
          <Typography variant="body" component="div">
            Name : {details?.patient_name}
          </Typography>
          <Typography variant="body" component="div">
            Phone : {details?.patient_phone}
          </Typography>
          <Typography variant="body" component="div">
            Address : {details?.patient_address}
          </Typography>
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
                {details?.bill_items &&
                  details.bill_items.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {generateID(row.id, row.created_time)}
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
            <Typography variant="body">{details?.total_amount}</Typography>
          </Box>
          <Divider sx={{ my: "6px" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body">Unpaid : </Typography>
            <Typography variant="body">{details?.total_amount}</Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default PaymentDetail;
