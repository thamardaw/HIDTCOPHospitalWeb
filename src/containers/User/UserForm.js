import {
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../hooks";
import React, { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { BackButton } from "../../components/common";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSetRecoilState } from "recoil";
import { withAlert } from "../../recoil/snackbar";

const UserForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const openAlert = useSetRecoilState(withAlert);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const getData = async () => {
    const res = await api.get(`/api/user/${id}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
  };

  const createNew = async () => {
    setLoading(true);
    if (details.password !== details.confirmPassword) {
      openAlert({ status: "error", detail: "Passwords do not match." });
      setLoading(false);
      return;
    }
    if (!details.role) {
      openAlert({ status: "error", detail: "Role Required." });
      setLoading(false);
      return;
    }
    const res = await api.post("/api/user", {
      username: details.username,
      password: details.password,
      role: details.role,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  const update = async () => {
    setLoading(true);
    const res = await api.put(`/api/user/${id}`, {
      role: details?.role,
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
        <BackButton backFunction={() => history.goBack()} />
        <Typography variant="h5">{id ? "Edit" : "New"}</Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
        {!id && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="p">Username*</Typography>
              </Box>
              <TextField
                size="small"
                sx={{ width: "70%" }}
                margin="dense"
                value={details?.username}
                name="username"
                onChange={handleChange}
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
                <Typography variant="p">Password*</Typography>
              </Box>
              <FormControl sx={{ width: "70%" }} size="small" margin="dense">
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  name="password"
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "30%" }}>
                <Typography variant="p">Confirm Password*</Typography>
              </Box>
              <FormControl sx={{ width: "70%" }} size="small" margin="dense">
                <OutlinedInput
                  type={showConfirmPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                  name="confirmPassword"
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
          </>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Role*</Typography>
          </Box>
          <TextField
            select
            size="small"
            margin="dense"
            label="Role"
            sx={{ width: "70%" }}
            value={details?.role}
            name="role"
            onChange={handleChange}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
            <MenuItem value="Cashier">Cashier</MenuItem>
          </TextField>
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
          variant="contained"
          loading={loading}
          size="small"
          sx={{ marginRight: "5px" }}
          onClick={id ? update : createNew}
        >
          Save
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default UserForm;
