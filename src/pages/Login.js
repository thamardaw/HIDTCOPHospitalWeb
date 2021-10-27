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
import { useState } from "react";
import { Link } from "react-router-dom";

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

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
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
              // value={values.password}
              // onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    //   onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Button fullWidth variant="contained" style={{ marginTop: "20px" }}>
            Log in
          </Button>
          <Button size="small" style={{ marginTop: "10px" }}>
            <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>
              <StyledLink to="/signup">Don't have an account?</StyledLink>
            </Typography>
          </Button>
        </StyledPaper>
      </StyledBox>
    </Container>
  );
};

export default Login;
