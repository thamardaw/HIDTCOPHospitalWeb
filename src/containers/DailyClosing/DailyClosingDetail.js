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
import { useEffect, useState } from "react";
import { useAxios } from "../../hooks";
import { generateID } from "../../utils/generateID";

const DailyClosingDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({});
  const [bills, setBills] = useState({});
  const [deposits, setDeposits] = useState({});
  const getData = async () => {
    const [detail, bill, deposit] = await Promise.all([
      api.get(`/api/dailyClosing/${id}`),
      api.get(`/api/dailyClosing/${id}/bills`),
      api.get(`/api/dailyClosing/${id}/deposits`),
    ]);
    if (
      detail.status === 200 &&
      bill.status === 200 &&
      deposit.status === 200
    ) {
      setDetails(detail.data);
      const b = bill.data.map((row) => {
        const ID = generateID(
          row.bill.patient.id,
          row.bill.patient.created_time
        );
        return {
          id: row.id,
          bill_id: row.bill_id,
          patient_id: ID,
          patient_name: row.bill.patient.name,
          total_amount: row.bill.payment[0].total_amount,
          deposit_amount: row.bill.payment[0].total_deposit_amount,
          collected_amount: row.bill.payment[0].collected_amount,
        };
      });
      setBills(b);
      const d = deposit.data.map((row) => {
        const ID = generateID(
          row.deposit.patient.id,
          row.deposit.patient.created_time
        );
        return {
          id: row.id,
          deposit_id: row.deposit.id,
          patient_id: ID,
          patient_name: row.deposit.patient.name,
          deposit_amount: row.deposit.amount,
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
        <Button variant="contained" size="small">
          Print
        </Button>
      </Toolbar>
      <Divider />
      <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">In Charge Name</Typography>
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
            <Typography variant="p">Opening Balance</Typography>
          </Box>
          <Typography variant="p">{details?.opening_balance}</Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 300, marginTop: "15px" }}>
          <Table sx={{ minWidth: 380 }} size="small">
            <TableHead stickyHeader sx={{ backgroundColor: "#EBEBEB" }}>
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
              {bills?.[0] &&
                bills.map((row) => (
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

        <TableContainer sx={{ maxHeight: 300, marginTop: "15px" }}>
          <Table sx={{ minWidth: 380 }} size="small">
            <TableHead stickyHeader sx={{ backgroundColor: "#EBEBEB" }}>
              <TableRow>
                <TableCell>Deposit ID</TableCell>
                <TableCell>Patient ID</TableCell>
                <TableCell>Patient Name</TableCell>
                <TableCell>Deposit Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deposits?.[0] &&
                deposits.map((row) => (
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
            <Typography variant="p">Total</Typography>
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
            <Typography variant="p">Actual Amount</Typography>
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
            <Typography variant="p">Adjustment</Typography>
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
            <Typography variant="p">Remark</Typography>
          </Box>
          <Typography variant="p">{details?.adjusted_reason}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DailyClosingDetail;
