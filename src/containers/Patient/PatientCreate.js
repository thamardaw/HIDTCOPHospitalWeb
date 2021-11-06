import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory } from "react-router";

const PatientCreate = () => {
  const history = useHistory();
  return (
    <Box sx={{ flexGrow: 1 }}>
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
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Name</Typography>
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
            <Typography variant="p">Age</Typography>
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
            <Typography variant="p">Phone Number</Typography>
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
            <Typography variant="p">Gender</Typography>
          </Box>
          {/* <TextField size="small" sx={{ width: "70%" }} margin="dense" /> */}
          <TextField
            select
            fullWidth
            label="Gender"
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Date Of Birth</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            placeholder="YYYY-MM-DD"
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
            <Typography variant="p">Address</Typography>
          </Box>
          <TextField size="small" sx={{ width: "70%" }} margin="dense" />
        </Box>
      </Box>
      <Divider />
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
        {/* <Button
          variant="contained"
          size="small"
          sx={{
            marginRight: "5px",
            backgroundColor: "gray",
            "&:hover": {
              backgroundColor: "lightgray",
            },
          }}
          onClick={() => history.goBack()}
        >
          Cancel
        </Button> */}
      </Box>
    </Box>
  );
};

export default PatientCreate;
