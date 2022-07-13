import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSetRecoilState } from "recoil";
import { withAlert } from "../recoil/snackbar";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: "auto",
  height: "320px",
  width: "30%",
  [theme.breakpoints.down("lg")]: {
    width: "40%",
  },
  [theme.breakpoints.down("md")]: {
    width: "50%",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100vw",
    height: "100vh",
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(4),
  flexDirection: "column",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    boxShadow: "none",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
}));

const Form = styled("form")(({ theme }) => ({}));

const ResetPassword = () => {
  const history = useHistory();
  const openAlert = useSetRecoilState(withAlert);
  const [details, setDetails] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (details.newPassword !== details.confirmNewPassword) {
      openAlert({ status: "error", detail: "Passwords do not match." });
      setLoading(false);
      return;
    }
    const res = await axios.put(
      `${process.env.REACT_APP_BASE_URL}/api/user/resetPassword`,
      {
        username: details.username,
        oldPassword: details.oldPassword,
        newPassword: details.newPassword,
      },
      {
        validateStatus: function (status) {
          return status < 500;
        },
      }
    );
    if (res.status === 200) {
      openAlert({ status: res.status, detail: res.data.detail });
      history.goBack();
    } else {
      openAlert({ status: res.status, detail: res.data.detail });
    }
    setLoading(false);
  };
  return (
    <StyledBox>
      <StyledPaper elevation={6}>
        <Form onSubmit={submitHandler}>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginBottom: "10px" }}
          >
            <InputLabel>Username</InputLabel>
            <Input name="username" onChange={handleChange} />
          </FormControl>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginBottom: "10px" }}
          >
            <InputLabel>Old Password</InputLabel>
            <Input
              type={showOldPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              name="oldPassword"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginBottom: "10px" }}
          >
            <InputLabel>New Password</InputLabel>
            <Input
              type={showNewPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              name="newPassword"
              onChange={handleChange}
            />
          </FormControl>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginBottom: "10px" }}
          >
            <InputLabel>Confirm New Password</InputLabel>
            <Input
              type={showConfirmNewPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  >
                    {showConfirmNewPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              name="confirmNewPassword"
              onChange={handleChange}
            />
          </FormControl>
          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            style={{ marginTop: "20px" }}
            type="submit"
          >
            Reset
          </LoadingButton>
        </Form>
        <Button size="small" style={{ marginTop: "10px" }}>
          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
            <StyledLink to="/login">Back</StyledLink>
          </Typography>
        </Button>
      </StyledPaper>
    </StyledBox>
  );
};

export default ResetPassword;
