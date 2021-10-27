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
import { useState } from "react";
import { Link } from "react-router-dom";

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

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
            />
          </FormControl>
          <TextField
            select
            required
            fullWidth
            label="Role"
            variant="standard"
            sx={{ marginBottom: "10px" }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
          </TextField>
          <Button fullWidth variant="contained" style={{ marginTop: "20px" }}>
            Sign up
          </Button>
          <Button size="small" style={{ marginTop: "10px" }}>
            <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
              <StyledLink to="/login">Already have an account?</StyledLink>
            </Typography>
          </Button>
        </StyledPaper>
      </StyledBox>
    </Container>
  );
};

export default Signup;
