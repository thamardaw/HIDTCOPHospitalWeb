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
import { useHistory } from "react-router-dom";
import { Box } from "@mui/system";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(159, "Asprin", 6.0, 24, 4.0),
  createData(150, "Decolgen", 6.0, 24, 4.0),
];

const PaymentDetail = () => {
  const history = useHistory();
  const receiptRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
  });

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
        <Button variant="contained" size="small" sx={{ marginRight: "5px" }}>
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
            Name : Aung Aung
          </Typography>
          <Typography variant="body" component="div">
            Phone : 09760614842
          </Typography>
          <Typography variant="body" component="div">
            Address : Yangon, Kamayut
          </Typography>
        </Box>
        <Box sx={{ my: "15px" }}>
          <TableContainer>
            <Table sx={{ minWidth: 380 }} aria-label="simple table">
              <TableHead sx={{ backgroundColor: "#EBEBEB" }}>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Charge</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell>SubTotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.calories}</TableCell>
                    <TableCell>{row.fat}</TableCell>
                    <TableCell>{row.carbs}</TableCell>
                    <TableCell>{row.protein}</TableCell>
                    <TableCell>{row.carbs}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ paddingBottom: "25px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body">Total : </Typography>
            <Typography variant="body">1000</Typography>
          </Box>
          <Divider sx={{ my: "6px" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body">Deposit : </Typography>
            <Typography variant="body">1000</Typography>
          </Box>
          <Divider sx={{ my: "6px" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body">Unpaid : </Typography>
            <Typography variant="body">1000</Typography>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default PaymentDetail;
