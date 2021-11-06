import { Divider, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory } from "react-router";

const PatientDetail = () => {
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
        <Typography variant="h5">Details</Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Name
            </Typography>
          </Box>
          {/* <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            defaultValue="Zay Maw"
            disabled={true}
          /> */}
          <Typography variant="body2">Zay Maw</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Age
            </Typography>
          </Box>
          {/* <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            defaultValue="18"
            disabled={true}
          /> */}
          <Box sx={{ width: "70%" }}>
            <Typography variant="body2">18</Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Contact Details
            </Typography>
          </Box>
          {/* <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            defaultValue="09760614842"
            disabled={true}
          /> */}
          <Box sx={{ width: "70%" }}>
            <Typography variant="body2">09760614842</Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Gender
            </Typography>
          </Box>
          {/* <TextField size="small" sx={{ width: "70%" }} margin="dense" /> */}
          {/* <TextField
            select
            fullWidth
            label="Gender"
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            defaultValue="male"
            disabled={true}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField> */}
          <Box sx={{ width: "70%" }}>
            <Typography variant="body2">Male</Typography>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Date Of Birth
            </Typography>
          </Box>
          {/* <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            placeholder="YYYY-MM-DD"
            defaultValue="2003-03-04"
            disabled={true}
          /> */}
          <Box sx={{ width: "70%" }}>
            <Typography variant="body2">2003-03-04</Typography>
          </Box>
        </Box>

        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Address
            </Typography>
          </Box>
          {/* <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            defaultValue="Yangon, Haling Township"
            disabled={true}
          /> */}
          <Box sx={{ width: "70%" }}>
            <Typography variant="body2">Yangon, Hlaing Township</Typography>
          </Box>
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
        {/* <Button variant="contained" size="small" sx={{ marginRight: "5px" }}>
          Save
        </Button> */}
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

export default PatientDetail;
