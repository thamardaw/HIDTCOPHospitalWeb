import {
  Autocomplete,
  Button,
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
        };
      });
      setPatient(data);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const createNew = async () => {
    const res = await api.post(`/api/deposit/`, {
      ...details,
    });
    if (res.status === 200) {
      history.goBack();
    }
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
      <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
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
          {/* <TextField
            select
            fullWidth
            label="Patient"
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.patient_id || ""}
            onChange={(e) =>
              setDetails({ ...details, patient_id: e.target.value })
            }
          >
            {patient.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.id}
              </MenuItem>
            ))}
          </TextField> */}
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
          onClick={createNew}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DepositForm;
