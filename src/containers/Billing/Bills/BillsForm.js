import {
  Autocomplete,
  Button,
  Container,
  IconButton,
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
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/system";
import { useHistory } from "react-router-dom";
import { useRouteMatch } from "react-router-dom/cjs/react-router-dom.min";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData(159, "Asprin", 6.0, 24, 4.0),
  createData(150, "Decolgen", 6.0, 24, 4.0),
];

const patient = ["Mg Mg", "Aung Aung"];
const medicine = ["Asprin", "Decolgen"];

const BillsForm = () => {
  const history = useHistory();
  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          //   sx={{ fontSize: { xs: "14px", sm: "16px" } }}
        >
          Patient Info
        </Typography>
      </Toolbar>
      <Container>
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
        >
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p">Patient Name</Typography>
            </Box>
            {/* <TextField size="small" sx={{ width: "90%" }} margin="normal" /> */}
            <Autocomplete
              value={null}
              options={patient}
              getOptionLabel={(option) => option}
              style={{ width: "90%" }}
              onChange={(event, newValue) => {
                console.log("hello");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  fullWidth
                  size="small"
                  margin="normal"
                />
              )}
            />
          </Box>
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p">Pateint ID</Typography>
            </Box>
            <TextField size="small" sx={{ width: "90%" }} margin="normal" />
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}
        >
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p">Phone</Typography>
            </Box>
            <TextField size="small" sx={{ width: "90%" }} margin="normal" />
          </Box>
          <Box
            sx={{
              flex: 0.5,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Box sx={{ width: "100%" }}>
              <Typography variant="p">Address</Typography>
            </Box>
            <TextField size="small" sx={{ width: "90%" }} margin="normal" />
          </Box>
        </Box>
      </Container>
      <Container sx={{ padding: "20px 0px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", md: "35%" },
            }}
          >
            <Box
              sx={{
                padding: "14px",
                width: "100%",
                border: "2px solid lightgray",
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="p">Sales & Service Item</Typography>
                </Box>
                {/* <TextField size="small" fullWidth margin="dense" />
                 */}
                <Autocomplete
                  value={null}
                  options={medicine}
                  fullWidth
                  getOptionLabel={(option) => option}
                  onChange={(event, newValue) => {
                    console.log("hello");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      fullWidth
                      size="small"
                      margin="normal"
                    />
                  )}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Typography variant="p">Quantity</Typography>
                </Box>
                <TextField size="small" fullWidth margin="dense" />
              </Box>
              <Box
                sx={{
                  paddingTop: "10px",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="contained">ADD</Button>
              </Box>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => history.push("/dashboard/payment/details/test")}
              >
                Print Invoice
              </Button>
            </Box>
            <Box sx={{ paddingTop: "10px" }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => history.goBack()}
              >
                Cancel
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "65%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Container sx={{ paddingTop: { xs: "20px", sm: "0px" } }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Bill Items
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontSize: { xs: "14px", sm: "16px" } }}
                >
                  Total : 0MMK
                </Typography>
              </Box>
            </Container>
            <Container sx={{ paddingTop: "10px" }}>
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table
                  sx={{ minWidth: 380 }}
                  aria-label="simple table"
                  size="small"
                >
                  <TableHead stickyHeader sx={{ backgroundColor: "#EBEBEB" }}>
                    <TableRow>
                      <TableCell>No</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Charge</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Unit</TableCell>
                      <TableCell align="right">SubTotal</TableCell>
                      <TableCell align="right">Actions</TableCell>
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
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">
                          <IconButton aria-label="delete" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Container>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default BillsForm;
