import {
  Button,
  Divider,
  IconButton,
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
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../../hooks";
import { generateID } from "../../utils/generateID";
import { useReactToPrint } from "react-to-print";

const DailyClosingDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({});
  const [bills, setBills] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const dailyClosingRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => dailyClosingRef.current,
  });

  const getData = async () => {
    const res = await api.get(`/api/dailyClosing/${id}`);
    if (res.status === 200) {
      setDetails(res.data);
      const b = res.data.bills.map((row) => {
        const ID = generateID(row.patient.id, row.patient.created_time);
        return {
          id: row.id,
          bill_id: row.id,
          patient_id: ID,
          patient_name: row.patient.name,
          total_amount: row.payment[0].total_amount,
          deposit_amount: row.payment[0].total_deposit_amount,
          collected_amount: row.payment[0].collected_amount,
        };
      });
      setBills(b);
      const d = res.data.deposits.map((row) => {
        const ID = generateID(row.patient.id, row.patient.created_time);
        return {
          id: row.id,
          deposit_id: row.id,
          patient_id: ID,
          patient_name: row.patient.name,
          deposit_amount: row.amount,
        };
      });
      setDeposits(d);
    } else {
      history.goBack();
    }
  };
  useEffect(() => {
    if (id) {
      getData();
    } else {
      history.goBack();
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <Toolbar
        sx={{
          display: "flex",
          paddingLeft: "12px",
        }}
        variant="dense"
        disableGutters={true}
      >
        <IconButton
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            borderRadius: "10%",
            "&:hover": {
              backgroundColor: "primary.light",
            },
            marginRight: "10px",
          }}
          onClick={() => history.goBack()}
          size="small"
        >
          <ArrowBackIosNewIcon size="small" />
        </IconButton>
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Detail
        </Typography>
        <Button variant="contained" size="small" onClick={handlePrint}>
          Print
        </Button>
      </Toolbar>
      <Divider />
      <Box
        sx={{ flexDirection: "column", padding: "20px 10px" }}
        ref={dailyClosingRef}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p" sx={{ fontWeight: "bold" }}>
              In Charge Name
            </Typography>
          </Box>
          <Typography variant="p">{details?.created_user?.username}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p" sx={{ fontWeight: "bold" }}>
              Opening Balance
            </Typography>
          </Box>
          <Typography variant="p">{details?.opening_balance}</Typography>
        </Box>
        <TableContainer sx={{ marginTop: "15px" }}>
          <Table sx={{ minWidth: 380 }} size="small">
            <TableHead sx={{ backgroundColor: "#EBEBEB" }}>
              <TableRow>
                <TableCell>Bill ID</TableCell>
                <TableCell>Patient ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Deposit Amount</TableCell>
                <TableCell>Collected Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.bill_id}
                  </TableCell>
                  <TableCell>{row.patient_id}</TableCell>
                  <TableCell>{row.patient_name}</TableCell>
                  <TableCell>{row.total_amount}</TableCell>
                  <TableCell>{row.deposit_amount}</TableCell>
                  <TableCell>{row.collected_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer sx={{ marginTop: "15px" }}>
          <Table sx={{ minWidth: 380 }} size="small">
            <TableHead sx={{ backgroundColor: "#EBEBEB" }}>
              <TableRow>
                <TableCell>Deposit ID</TableCell>
                <TableCell>Patient ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Deposit Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deposits.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.deposit_id}
                  </TableCell>
                  <TableCell>{row.patient_id}</TableCell>
                  <TableCell>{row.patient_name}</TableCell>
                  <TableCell>{row.deposit_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "10px 0px",
            marginTop: "10px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p" sx={{ fontWeight: "bold" }}>
              Total
            </Typography>
          </Box>
          <Typography variant="p">{details?.grand_total}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p" sx={{ fontWeight: "bold" }}>
              Actual Amount
            </Typography>
          </Box>
          <Typography variant="p">{details?.actual_amount}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p" sx={{ fontWeight: "bold" }}>
              Adjustment
            </Typography>
          </Box>
          <Typography variant="p">{details?.adjusted_amount}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p" sx={{ fontWeight: "bold" }}>
              Remark
            </Typography>
          </Box>
          <Typography variant="p">{details?.adjusted_reason}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DailyClosingDetail;
