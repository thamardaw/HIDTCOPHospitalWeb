import {
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
  TableContainer,
  TableHead,
  TableRow,
  TextField,
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
  fontSize: "inherit",
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
  const [fontSizes, setFontSizes] = useState({
    title: "30",
    texts: "16",
    table: "14",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <>
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
            sx={{
              marginRight: "5px",
              display: showPay ? "block" : "none",
              textTransform: "none",
            }}
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
            sx={{ marginRight: "5px", textTransform: "none" }}
            onClick={handleClick}
          >
            Font Size
          </Button>
        </Toolbar>
        <Container ref={receiptRef}>
          <Box sx={{ my: "15px", fontSize: `${fontSizes.title}px` }}>
            <StyledTypography
              variant="h6"
              textAlign="center"
              onClick={handleClick}
            >
              Dagon Lin Hospital
            </StyledTypography>

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
            <Box
              sx={{
                flexDirection: "column",
                paddingTop: "15px",
                fontSize: `${fontSizes.texts}px`,
              }}
            >
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
          <Box sx={{ my: "15px", fontSize: `${fontSizes.table}px` }}>
            <TableContainer>
              <Table sx={{ width: "100%" }} aria-label="simple table">
                <TableHead
                  sx={{
                    backgroundColor: "#EBEBEB",
                  }}
                >
                  <TableRow>
                    <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                      <StyledTypography>No</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                      <StyledTypography>Name</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                      <StyledTypography>Price</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                      <StyledTypography>Quantity</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                      <StyledTypography>UOM</StyledTypography>
                    </TableCell>
                    <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                      <StyledTypography>SubTotal</StyledTypography>
                    </TableCell>
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
                        <TableCell
                          sx={{ fontSize: `${fontSizes.table}px` }}
                          component="th"
                          scope="row"
                        >
                          <StyledTypography>{index + 1}</StyledTypography>
                          {/* {generateID(row.id, row.created_time)} */}
                        </TableCell>
                        <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                          <StyledTypography>{row?.name}</StyledTypography>
                        </TableCell>
                        <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                          <StyledTypography>{row?.price}</StyledTypography>
                        </TableCell>
                        <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                          <StyledTypography>{row?.quantity}</StyledTypography>
                        </TableCell>
                        <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                          <StyledTypography>{row?.uom}</StyledTypography>
                        </TableCell>
                        <TableCell sx={{ fontSize: `${fontSizes.table}px` }}>
                          <StyledTypography>{row?.subtotal}</StyledTypography>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ paddingBottom: "25px", fontSize: `${fontSizes.texts}px` }}>
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
          </Box>
        </Container>
      </Paper>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
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
            label="Title"
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            size="small"
            sx={{ width: "120px" }}
            value={fontSizes.title}
            onChange={(e) =>
              setFontSizes({ ...fontSizes, title: e.target.value })
            }
          />
        </MenuItem>
        <MenuItem>
          <TextField
            label="Text"
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            size="small"
            sx={{ width: "120px" }}
            value={fontSizes.texts}
            onChange={(e) =>
              setFontSizes({ ...fontSizes, texts: e.target.value })
            }
          />
        </MenuItem>
        <MenuItem>
          <TextField
            label="Table"
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            size="small"
            sx={{ width: "120px" }}
            value={fontSizes.table}
            onChange={(e) =>
              setFontSizes({ ...fontSizes, table: e.target.value })
            }
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default BillsDetail;
