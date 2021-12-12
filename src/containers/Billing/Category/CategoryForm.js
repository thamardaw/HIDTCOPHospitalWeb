import {
  Button,
  Divider,
  IconButton,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../../hooks";
import React, { useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const CategoryForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({
    name: "",
    description: "",
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
    const res = await api.get(`/api/category/${parseInt(id.split("-")[1])}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
  };

  const createNew = async () => {
    const res = await api.post(`/api/category/`, {
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
    const res = await api.put(`/api/category/${parseInt(id.split("-")[1])}`, {
      name: details.name,
      description: details.description,
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
              <Typography variant="p">Description</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.description || ""}
              onChange={(e) =>
                setDetails({ ...details, description: e.target.value })
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

export default CategoryForm;
