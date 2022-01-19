import { Divider, IconButton, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../hooks";
import { useEffect, useState } from "react";
import { generateID } from "../../utils/generateID";

const PatientDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({});

  const getData = async () => {
    const res = await api.get(`/api/patients/${parseInt(id.split("-")[1])}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
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
              ID
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
            <Typography variant="body2">
              {generateID(details.id, details.created_time)}
            </Typography>
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
          <Typography variant="body2">{details?.name}</Typography>
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
            <Typography variant="body2">{details?.age}</Typography>
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
            <Typography variant="body2">{details?.contact_details}</Typography>
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
            <Typography variant="body2">{details?.gender}</Typography>
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
            <Typography variant="body2">{details.date_of_birth}</Typography>
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
            <Typography variant="body2">{details?.address}</Typography>
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
