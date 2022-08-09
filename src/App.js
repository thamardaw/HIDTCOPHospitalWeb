import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { RecoilRoot } from "recoil";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Login, Signup, Dashboard, ResetPassword } from "./containers";
import { CustomSnackbar } from "./hocs/CustomSnackbar";
import PrivateRoute from "./hocs/PrivateRoute";

function App() {
  return (
    <RecoilRoot>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CustomSnackbar>
          <Router>
            <Switch>
              <PrivateRoute path="/dashboard" component={Dashboard} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/resetPassword" component={ResetPassword} />
              <Redirect to="/dashboard" />
            </Switch>
          </Router>
        </CustomSnackbar>
      </LocalizationProvider>
    </RecoilRoot>
  );
}

export default App;
