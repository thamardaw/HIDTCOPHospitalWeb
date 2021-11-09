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
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import axios from "axios";
import { useHistory } from "react-router-dom";

// const Container = styled("div")(({ theme }) => ({
//   display: "flex",
//   position: "absolute",
//   top: 0,
//   bottom: 0,
//   left: 0,
//   right: 0,
//   margin: "auto",
//   width: "30%",
//   height: "320px",
//   [theme.breakpoints.down("md")]: {
//     width: "50%",
//   },
//   [theme.breakpoints.down("sm")]: {
//     width: "100vw",
//     height: "100vh",
//   },
// }));

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   height: "100%",
//   width: "100%",
//   display: "flex",
//   padding: theme.spacing(4),
//   flexDirection: "column",
//   alignItems: "center",
// }));

const Container = styled("div")(({ theme }) => ({
  width: "100vw",
  height: "100vh",
}));

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
    height: "92%",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = () => {
  const history = useHistory();
  const [details, setDetails] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (details.password !== details.confirmPassword) {
      setMessage({ status: "error", detail: "Passwords do not match." });
      setOpenAlert(true);
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
      setMessage({ status: res.status, detail: res.data.detail });
      setOpenAlert(true);
      // history.goBack();
    } else {
      setMessage({ status: res.status, detail: res.data.detail });
      setOpenAlert(true);
    }
  };
  return (
    <>
      <Container>
        <StyledBox>
          <StyledPaper elevation={6}>
            <form onSubmit={submitHandler}>
              <FormControl
                fullWidth
                required
                variant="standard"
                sx={{ marginBottom: "10px" }}
              >
                <InputLabel>Username</InputLabel>
                <Input
                  onChange={(e) =>
                    setDetails({ ...details, username: e.target.value })
                  }
                />
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
                  onChange={(e) =>
                    setDetails({ ...details, password: e.target.value })
                  }
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
                  onChange={(e) =>
                    setDetails({ ...details, confirmPassword: e.target.value })
                  }
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
                onChange={(e) =>
                  setDetails({ ...details, role: e.target.value })
                }
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Receptionist">Receptionist</MenuItem>
              </TextField>
              <Button
                fullWidth
                variant="contained"
                style={{ marginTop: "20px" }}
                type="submit"
              >
                Sign up
              </Button>
            </form>
            <Button size="small" style={{ marginTop: "10px" }}>
              <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
                <StyledLink to="/login">Already have an account?</StyledLink>
              </Typography>
            </Button>
          </StyledPaper>
        </StyledBox>
      </Container>
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

export default Signup;
