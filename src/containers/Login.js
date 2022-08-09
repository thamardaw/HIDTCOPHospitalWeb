import { Visibility, VisibilityOff } from "@mui/icons-material";
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
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import authAtom from "../recoil/auth";
import { withAlert } from "../recoil/snackbar";

const StyledBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  margin: "auto",
  height: "230px",
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

const Login = () => {
  const history = useHistory();
  const setAuth = useSetRecoilState(authAtom);
  const openAlert = useSetRecoilState(withAlert);
  const [showPassword, setShowPassword] = useState(false);
  const [details, setDetails] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", details.username);
    formData.append("password", details.password);
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/login`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        validateStatus: function (status) {
          return status < 500;
        },
      }
    );
    if (res.status === 200) {
      setAuth(res.data);
      localStorage.setItem("genesis-auth-tokens", JSON.stringify(res.data));
      history.push("/");
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
            <InputLabel>Password</InputLabel>
            <Input
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
          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            style={{ marginTop: "20px" }}
            type="submit"
          >
            Log in
          </LoadingButton>
        </Form>
        <Button size="small" style={{ marginTop: "10px" }}>
          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
            <StyledLink to="/signup">Don't have an account?</StyledLink>
          </Typography>
        </Button>
        <Button size="small" style={{ marginTop: "5px" }}>
          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
            <StyledLink to="/resetPassword">Reset password.</StyledLink>
          </Typography>
        </Button>
      </StyledPaper>
    </StyledBox>
  );
};

export default Login;
