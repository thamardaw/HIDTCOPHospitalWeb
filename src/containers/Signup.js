import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
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

const Signup = () => {
  const history = useHistory();
  const openAlert = useSetRecoilState(withAlert);
  const [details, setDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (details.password !== details.confirmPassword) {
      openAlert({ status: "error", detail: "Passwords do not match." });
      setLoading(false);
      return;
    }
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/user`,
      {
        username: details.username,
        password: details.password,
        role: details.role,
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
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginBottom: "10px" }}
          >
            <InputLabel>Confirm Password</InputLabel>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              name="confirmPassword"
              onChange={handleChange}
            />
          </FormControl>
          <TextField
            select
            required
            fullWidth
            label="Role"
            variant="standard"
            sx={{ marginBottom: "10px" }}
            value={details.role}
            name="role"
            onChange={handleChange}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
            <MenuItem value="Cashier">Cashier</MenuItem>
          </TextField>
          <LoadingButton
            fullWidth
            loading={loading}
            variant="contained"
            style={{ marginTop: "20px" }}
            type="submit"
          >
            Sign up
          </LoadingButton>
        </Form>
        <Button size="small" style={{ marginTop: "10px" }}>
          <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
            <StyledLink to="/login">Already have an account?</StyledLink>
          </Typography>
        </Button>
      </StyledPaper>
    </StyledBox>
  );
};

export default Signup;
