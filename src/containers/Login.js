import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import { AuthContext } from "../contexts";

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
    height: "92%",
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  let { loginUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [details, setDetails] = useState({ username: "", password: "" });
  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState("");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMessage("");
    setOpenAlert(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    await loginUser(details, setMessage, setOpenAlert);
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
              <Button
                fullWidth
                variant="contained"
                style={{ marginTop: "20px" }}
                type="submit"
              >
                Log in
              </Button>
            </form>
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
      </Container>
      <Snackbar
        open={openAlert}
        autoHideDuration={1500}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">{message}</Alert>
      </Snackbar>
    </>
  );
};

export default Login;
