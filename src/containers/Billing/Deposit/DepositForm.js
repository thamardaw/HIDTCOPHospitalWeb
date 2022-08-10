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
import { useHistory } from "react-router";
import { useAxios } from "../../../hooks";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { generateID } from "../../../utils/generateID";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import { BackButton, DetailsRow } from "../../../components/common";

const DepositForm = () => {
  const history = useHistory();
  const api = useAxios({ autoSnackbar: true });
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
      history.replace({
        pathname: `/dashboard/deposit/details/${res.data.id}`,
        state: {
          from: "active",
        },
      });
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
        <BackButton backFunction={() => history.goBack()} />
        <Typography variant="h5">New</Typography>
      </Toolbar>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          padding: "20px 10px",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
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
                style={{ width: "90%" }}
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
                onClick={() => history.push("/dashboard/patient/form")}
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
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                // style={{ width: "85%" }}
                fullWidth
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
              <Box sx={{ width: "45px" }}></Box>
            </Box>
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
        <Box
          sx={{
            width: { xs: "100%", md: "65%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Container sx={{ paddingTop: { xs: "20px", sm: "10px", md: "0px" } }}>
            <DetailsRow
              name="Date"
              value={getCurrentDate()}
              padding="6px 5px"
              textVariant="body"
              marginV="0px"
            />
            <DetailsRow
              name="Patient ID"
              value={
                details?.patient_id &&
                generateID(details?.patient_id, details?.patient.created_time)
              }
              padding="6px 5px"
              textVariant="body"
              marginV="0px"
            />
            <DetailsRow
              name="Patient Name"
              value={details?.patient?.name}
              padding="6px 5px"
              textVariant="body"
              marginV="0px"
            />
            <DetailsRow
              name="Patient Phone"
              value={details?.patient?.contactDetails}
              padding="6px 5px"
              textVariant="body"
              marginV="0px"
            />
            <DetailsRow
              name="Patient Address"
              value={details?.patient?.address}
              padding="6px 5px"
              textVariant="body"
              marginV="0px"
            />
            <DetailsRow
              name="Amount"
              value={`${details?.amount} ${details?.amount && "MMK"}`}
              padding="6px 5px"
              textVariant="body"
              marginV="0px"
            />
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
