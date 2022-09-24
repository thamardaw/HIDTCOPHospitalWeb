import { LoadingButton } from "@mui/lab";
import {
  Checkbox,
  Divider,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { BackButton } from "../../../components/common";
import { useAxios } from "../../../hooks";

const PaymentTypeForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true })
  const [details, setDetails] = useState({
    name: null,
    is_default: false,
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };
  const handleChangeBoolean = (e) => {
    console.log(e.target.checked);
    setDetails({ ...details, [e.target.name]: e.target.checked });
  };
  const getData = async () => {
    const res = await api.get(`/api/payment_types/${parseInt(id)}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
  };
  const createNew = async () => {
    setLoading(true);
    const res = await api.post(`/api/payment_types/`, {
      ...details,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };
  const update = async () => {
    setLoading(true);
    const res = await api.put(`/api/payment_types/${parseInt(id)}`, {
      ...details,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };
  useEffect(() => {
    if (id) {
      getData();
    }
    //eslint-disable-next-line
  }, []);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar
          sx={{ display: "flex", paddingLeft: "12px" }}
          variant="dense"
          disableGutters={true}
        >
          <BackButton backFunction={() => history.goBack()} />
          <Typography variant="h5">{id ? "Edit" : "New"}</Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">New*</Typography>
            </Box>
            <TextField
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.name}
              name="name"
              onChange={handleChange}
            />
          </Box>
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="p">Is Default</Typography>
            </Box>
            <Checkbox 
            sx={{ width: "0" }} 
            checked={details?.is_default} 
            name="is_default" 
            onChange={handleChangeBoolean}/>
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
          <LoadingButton
            loading={loading}
            variant="contained"
            size="small"
            sx={{ marginRight: "5px" }}
            onClick={id ? update : createNew}
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default PaymentTypeForm;
