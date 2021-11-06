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
import { Link } from "react-router-dom";
// import MuiAlert from "@mui/material/Alert";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

const ResetPassword = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  return (
    <Container>
      <StyledBox>
        <StyledPaper elevation={6}>
          <FormControl
            fullWidth
            required
            variant="standard"
            sx={{ marginBottom: "10px" }}
          >
            <InputLabel>Username</InputLabel>
            <Input />
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
            />
          </FormControl>
          <Button fullWidth variant="contained" style={{ marginTop: "20px" }}>
            Sign up
          </Button>
          <Button size="small" style={{ marginTop: "10px" }}>
            <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
              <StyledLink to="/login">Back</StyledLink>
            </Typography>
          </Button>
        </StyledPaper>
      </StyledBox>
    </Container>
  );
};

export default ResetPassword;
