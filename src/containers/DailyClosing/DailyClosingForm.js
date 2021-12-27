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
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/system";
import { useContext } from "react";
import { AuthContext } from "../../contexts";

const DailyClosingForm = () => {
  const history = useHistory();
  let { user } = useContext(AuthContext);
  const billItems = [];
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
          <TextField size="small" sx={{ width: "70%" }} margin="dense" />
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
            <TextField size="small" sx={{ width: "40%" }} margin="dense" />
            <Typography>To</Typography>
            <TextField size="small" sx={{ width: "40%" }} margin="dense" />
          </Box>
          <Button
            variant="contained"
            size="small"
            sx={{ width: { xs: "100%", sm: "0" }, marginTop: "20px" }}
          >
            Add
          </Button>
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
              {billItems.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
                  <TableCell>{row.uom}</TableCell>
                  <TableCell>{row.price * row.quantity}</TableCell>
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
            <TextField size="small" sx={{ width: "40%" }} margin="dense" />
            <Typography>To</Typography>
            <TextField size="small" sx={{ width: "40%" }} margin="dense" />
          </Box>
          <Button
            variant="contained"
            size="small"
            sx={{ width: { xs: "100%", sm: "0" }, marginTop: "20px" }}
          >
            Add
          </Button>
        </Box>
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
              {billItems.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.quantity}</TableCell>
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
          <TextField size="small" sx={{ width: "70%" }} margin="dense" />
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
          <TextField size="small" sx={{ width: "70%" }} margin="dense" />
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
          <TextField size="small" sx={{ width: "70%" }} margin="dense" />
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
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "20px 10px",
        }}
      >
        <Button variant="contained" size="small" sx={{ marginRight: "5px" }}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DailyClosingForm;
