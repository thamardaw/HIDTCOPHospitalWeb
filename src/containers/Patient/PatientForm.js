import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../hooks";
import React, { useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const PatientForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({
    name: "",
    age: "",
    contact_details: "",
    gender: "",
    date_of_birth: "",
    address: "",
  });
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState({
    status: "",
    detail: "",
  });
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenAlert(false);
    setMessage({ status: message.status, detail: "" });
  };

  const getData = async () => {
    const res = await api.get(`/api/patients/${parseInt(id.split("-")[1])}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    }
  };

  const createNew = async () => {
    const res = await api.post(`/api/patients`, {
      ...details,
    });
    if (res.status === 200) {
      setMessage({ status: res.status, detail: res.data.detail });
      setOpenAlert(true);
      setTimeout(() => {
        history.goBack();
      }, 1000);
    } else {
      if (res.status === 422) {
        setMessage({ status: res.status, detail: res.data.detail[0].msg });
        setOpenAlert(true);
      } else {
        setMessage({ status: res.status, detail: res.data.detail });
        setOpenAlert(true);
      }
    }
  };

  const update = async () => {
    const res = await api.put(`/api/patients/${parseInt(id.split("-")[1])}`, {
      name: details.name,
      age: details.age,
      contact_details: details.contact_details,
      gender: details.gender,
      date_of_birth: details.date_of_birth,
      address: details.address,
    });
    if (res.status === 200) {
      setMessage({ status: res.status, detail: res.data.detail });
      setOpenAlert(true);
      setTimeout(() => {
        history.goBack();
      }, 1000);
    } else {
      if (res.status === 422) {
        setMessage({ status: res.status, detail: res.data.detail[0].msg });
        setOpenAlert(true);
      } else {
        setMessage({ status: res.status, detail: res.data.detail });
        setOpenAlert(true);
      }
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <>
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
          <Typography variant="h5">{id ? "Edit" : "New"}</Typography>
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
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.name || ""}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
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
              <Typography variant="p">Age</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.age || ""}
              onChange={(e) => setDetails({ ...details, age: e.target.value })}
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
              <Typography variant="p">Contact Details</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.contact_details || ""}
              onChange={(e) =>
                setDetails({ ...details, contact_details: e.target.value })
              }
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
              value={details?.gender || ""}
              onChange={(e) =>
                setDetails({ ...details, gender: e.target.value })
              }
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
              value={details?.date_of_birth || ""}
              onChange={(e) =>
                setDetails({ ...details, date_of_birth: e.target.value })
              }
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
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.address || ""}
              onChange={(e) =>
                setDetails({ ...details, address: e.target.value })
              }
            />
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
          <Button
            variant="contained"
            size="small"
            sx={{ marginRight: "5px" }}
            onClick={id ? update : createNew}
          >
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
      <Snackbar
        open={openAlert}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={message.status === 200 ? "success" : "error"}>
          {message.detail}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PatientForm;