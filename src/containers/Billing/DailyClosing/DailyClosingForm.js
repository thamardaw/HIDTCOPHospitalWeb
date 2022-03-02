import {
  Button,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import { AuthContext } from "../../../contexts";
import { useAxios } from "../../../hooks";
import { generateID } from "../../../utils/generateID";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const DailyClosingForm = () => {
  const history = useHistory();
  let { user } = useContext(AuthContext);
  const api = useAxios();
  const [bills, setBills] = useState([]);
  const [billLimit, setBillLimit] = useState({
    from: 0,
    to: 0,
  });
  const [deposits, setDeposits] = useState([]);
  const [depositLimit, setDepositLimit] = useState({
    from: 0,
    to: 0,
  });
  const [billTotal, setBillTotal] = useState(0);
  const [depositTotal, setDepositTotal] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [actualAmount, setActualAmount] = useState(0);
  const [adjustedAmount, setAdjustedAmount] = useState(0);
  const [adjustedReason, setAdjustedReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setGrandTotal(
      parseInt(billTotal) +
        parseInt(depositTotal) +
        parseInt(openingBalance === "" ? 0 : openingBalance)
    );
  }, [billTotal, depositTotal, openingBalance]);

  useEffect(() => {
    setAdjustedAmount(
      parseInt(grandTotal) - parseInt(actualAmount === "" ? 0 : actualAmount)
    );
  }, [grandTotal, actualAmount]);

  const getBills = async () => {
    const res = await api.get(
      `/api/bill/?f=${billLimit.from}&t=${billLimit.to}`
    );
    if (res.status === 200) {
      let total = 0;
      const data = res.data.map((row) => {
        total += row.total_amount;
        const ID = generateID(row.patient.id, row.patient.created_time);
        return {
          bill_id: row.id,
          amount: row.total_amount,
          patient_id: ID,
          patient_name: row.patient.name,
          deposit_amount: row.payment[0]?.total_deposit_amount,
          collected_amount: row.payment[0]?.collected_amount,
        };
      });
      setBillTotal(total);
      setBills(data);
    } else {
      setBillTotal(0);
      setBills([]);
    }
  };

  const getDeposits = async () => {
    const res = await api.get(
      `/api/deposit/?f=${depositLimit.from}&t=${depositLimit.to}`
    );
    if (res.status === 200) {
      let total = 0;
      const data = res.data.map((row) => {
        total += row.amount;
        const ID = generateID(row.patient.id, row.patient.created_time);
        return {
          deposit_id: row.id,
          amount: row.amount,
          patient_id: ID,
          patient_name: row.patient.name,
        };
      });
      setDepositTotal(total);
      setDeposits(data);
    } else {
      setDepositTotal(0);
      setDeposits([]);
    }
  };

  const createNew = async () => {
    if (bills.length !== 0 || deposits.length !== 0) {
      setLoading(true);
      const res = await api.post(`/api/dailyClosing/`, {
        opening_balance: openingBalance,
        grand_total: grandTotal,
        actual_amount: actualAmount,
        adjusted_amount: adjustedAmount,
        adjusted_reason: adjustedReason,
        closing_deposit_detail: deposits,
        closing_bill_detail: bills,
      });
      if (res.status === 200) {
        history.replace(
          `/dashboard/dailyClosing/details/${res.data.id}/drafted`
        );
      }
      setLoading(false);
    }
  };

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
        <Typography variant="h5">New</Typography>
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
          <Typography variant="p">{user.sub}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Opening Balance</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={openingBalance}
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            onChange={(e) => {
              // setDetails({
              //   ...details,
              //   opening_balance: e.target.value,
              // });
              setOpeningBalance(e.target.value);
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <Box sx={{ paddingTop: "10px", width: "50px" }}>
            <Typography variant="p" fontWeight="bold">
              Bills
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "10px",
            }}
          >
            <Typography>From</Typography>
            <TextField
              size="small"
              sx={{ width: "40%" }}
              margin="dense"
              type="number"
              InputProps={{
                inputProps: { min: "0", step: "1" },
              }}
              value={billLimit.from}
              onChange={(e) =>
                setBillLimit({ ...billLimit, from: e.target.value })
              }
            />
            <Typography>To</Typography>
            <TextField
              size="small"
              sx={{ width: "40%" }}
              margin="dense"
              type="number"
              InputProps={{
                inputProps: { min: "0", step: "1" },
              }}
              value={billLimit.to}
              onChange={(e) =>
                setBillLimit({ ...billLimit, to: e.target.value })
              }
            />
          </Box>
          <Button
            variant="contained"
            size="small"
            sx={{ width: { xs: "100%", sm: "0" }, marginTop: "20px" }}
            onClick={getBills}
          >
            Confirm
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 300, marginTop: "15px" }}>
          <Table sx={{ minWidth: 380 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Bill ID</StyledTableCell>
                <StyledTableCell>Patient ID</StyledTableCell>
                <StyledTableCell>Patient Name</StyledTableCell>
                <StyledTableCell>Total Amount</StyledTableCell>
                <StyledTableCell>Deposit Amount</StyledTableCell>
                <StyledTableCell>Collected Amount</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.bill_id}
                  </TableCell>
                  <TableCell>{row.patient_id}</TableCell>
                  <TableCell>{row.patient_name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
                  <TableCell>{row.deposit_amount}</TableCell>
                  <TableCell>{row.collected_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            marginTop: "15px",
          }}
        >
          <Box sx={{ paddingTop: "10px", width: "50px" }}>
            <Typography variant="p" fontWeight="bold">
              Deposits
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "10px",
            }}
          >
            <Typography>From</Typography>
            <TextField
              size="small"
              sx={{ width: "40%" }}
              margin="dense"
              type="number"
              InputProps={{
                inputProps: { min: "0", step: "1" },
              }}
              value={depositLimit.from}
              onChange={(e) =>
                setDepositLimit({ ...depositLimit, from: e.target.value })
              }
            />
            <Typography>To</Typography>
            <TextField
              size="small"
              sx={{ width: "40%" }}
              margin="dense"
              type="number"
              InputProps={{
                inputProps: { min: "0", step: "1" },
              }}
              value={depositLimit.to}
              onChange={(e) =>
                setDepositLimit({ ...depositLimit, to: e.target.value })
              }
            />
          </Box>
          <Button
            variant="contained"
            size="small"
            sx={{ width: { xs: "100%", sm: "0" }, marginTop: "20px" }}
            onClick={getDeposits}
          >
            Confirm
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 300, marginTop: "15px" }}>
          <Table sx={{ minWidth: 380 }} size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <StyledTableCell>Deposit ID</StyledTableCell>
                <StyledTableCell>Patient ID</StyledTableCell>
                <StyledTableCell>Patient Name</StyledTableCell>
                <StyledTableCell>Deposit Amount</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deposits.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.deposit_id}
                  </TableCell>
                  <TableCell>{row.patient_id}</TableCell>
                  <TableCell>{row.patient_name}</TableCell>
                  <TableCell>{row.amount}</TableCell>
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
            paddingTop: "20px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Total</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={grandTotal}
            disabled
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Actual Amount</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={actualAmount}
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            onChange={(e) => setActualAmount(e.target.value)}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Adjustment</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={adjustedAmount}
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            // onChange={(e) => setAdjustedAmount(e.target.value)}
            disabled
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Remark</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            multiline
            rows={3}
            value={adjustedReason}
            onChange={(e) => setAdjustedReason(e.target.value)}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <LoadingButton
          loading={loading}
          variant="contained"
          size="small"
          sx={{ marginRight: "5px" }}
          onClick={createNew}
        >
          Save
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default DailyClosingForm;
