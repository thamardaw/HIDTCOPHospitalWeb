import {
  Button,
  Container,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";

const Bills = () => {
  return (
    <Paper sx={{ width: "100%", mb: 2 }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ fontSize: { xs: "14px", sm: "16px" } }}
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
              <Typography variant="p">Pateint Reg</Typography>
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
              flex: 0.35,
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
                <TextField size="small" fullWidth margin="dense" />
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
              <Button variant="contained" fullWidth>
                Print Invoice
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 0.65,
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
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default Bills;
