import {
  Autocomplete,
  Container,
  Divider,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory } from "react-router";
import { useAxios } from "../../../hooks";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { generateID } from "../../../utils/generateID";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";

const DepositForm = () => {
  const history = useHistory();
  const api = useAxios();
  const [details, setDetails] = useState({
    patient_id: null,
    patient: null,
    amount: "",
    remark: "",
  });
  const [patient, setPatient] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${mm}-${dd}`;
  };

  const getPatient = useCallback(async () => {
    const res = await api.get("/api/patients/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        return {
          id: ID,
          name: row.name,
          age: row.age.toString(),
          contactDetails: row.contact_details,
          gender: row.gender,
          dataOfBirth: row.date_of_birth,
          address: row.address,
          created_time: row.created_time,
        };
      });
      setPatient(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const createNew = async () => {
    setLoading(true);
    const res = await api.post(`/api/deposit/`, {
      ...details,
    });
    if (res.status === 200) {
      history.replace(`/dashboard/deposit/details/${res.data.id}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPatient();
    // eslint-disable-next-line
  }, []);
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
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          padding: "10px 0px",
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
                <Typography variant="p">Select Patient</Typography>
              </Box>
              {/* <TextField size="small" fullWidth margin="dense" />
               */}
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  value={details?.patient}
                  options={patient}
                  getOptionLabel={(option) => `${option.name}, ${option.id}`}
                  style={{ width: "900%" }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setDetails({
                        ...details,
                        patient: newValue,
                        patient_id: parseInt(newValue.id.split("-")[1]),
                      });
                    } else {
                      setDetails({
                        ...details,
                        patient: newValue,
                        patient_id: null,
                      });
                    }
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
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ marginTop: "5px" }}
                  onClick={() =>
                    history.push("/dashboard/salesServiceItem/form")
                  }
                >
                  <AddIcon fontSize="large" />
                </IconButton>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{ width: "100%" }}>
                <Typography variant="p">Amount</Typography>
              </Box>
              <TextField
                style={{ width: "85%" }}
                size="small"
                margin="normal"
                value={details?.amount || ""}
                type="number"
                InputProps={{
                  inputProps: { min: "0", step: "1" },
                }}
                onChange={(e) =>
                  setDetails({ ...details, amount: e.target.value })
                }
              />
            </Box>
            <Box
              sx={{
                paddingTop: "10px",
                display: "flex",
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
                flexDirection: "row",
                alignItems: "center",
                margin: "12px 0px",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="body">Date</Typography>
              </Box>
              <Typography variant="body">: {getCurrentDate()}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="body">Patient ID</Typography>
              </Box>
              <Typography variant="body">
                :{" "}
                {details?.patient_id &&
                  generateID(
                    details?.patient_id,
                    details?.patient.created_time
                  )}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "12px 0px",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="body">Patient Name</Typography>
              </Box>
              <Typography variant="body">: {details?.patient?.name}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "12px 0px",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="body">Patient Phone</Typography>
              </Box>
              <Typography variant="body">
                : {details?.patient?.contactDetails}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "12px 0px",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="body">Patient Address</Typography>
              </Box>
              <Typography variant="body">
                : {details?.patient?.address}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "12px 0px",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="body">Amount</Typography>
              </Box>
              <Typography variant="body">
                : {details?.amount} {details?.amount && "MMK"}
              </Typography>
            </Box>
          </Container>
        </Box>
      </Box>
      {/* <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Patient ID</Typography>
          </Box>
          <Autocomplete
            value={details?.patient}
            options={patient}
            getOptionLabel={(option) => option.id}
            style={{ width: "70%" }}
            onChange={(event, newValue) => {
              if (newValue) {
                setDetails({
                  ...details,
                  patient: newValue,
                  patient_id: parseInt(newValue.id.split("-")[1]),
                });
              } else {
                setDetails({
                  ...details,
                  patient: newValue,
                  patient_id: null,
                });
              }
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
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Patient Name</Typography>
          </Box>
          <Autocomplete
            value={details?.patient}
            options={patient}
            getOptionLabel={(option) => option.name}
            style={{ width: "70%" }}
            onChange={(event, newValue) => {
              if (newValue) {
                setDetails({
                  ...details,
                  patient: newValue,
                  patient_id: parseInt(newValue.id.split("-")[1]),
                });
              } else {
                setDetails({
                  ...details,
                  patient: newValue,
                  patient_id: null,
                });
              }
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
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Amount</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.amount || ""}
            onChange={(e) => setDetails({ ...details, amount: e.target.value })}
          />
        </Box>
      </Box> */}
      {/* <Divider /> */}
      {/* <Box
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
          onClick={createNew}
        >
          Save
        </LoadingButton>
      </Box> */}
    </Box>
  );
};

export default DepositForm;
