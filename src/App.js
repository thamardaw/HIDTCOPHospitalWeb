import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Login, Signup, Dashboard, ResetPassword } from "./containers";
import PrivateRoute from "./utils/PrivateRoute";
import { SnackbarProvider } from "./contexts/SnackbarContext";

function App() {
  return (
    <Router>
      <SnackbarProvider>
        <AuthProvider>
          <Switch>
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/resetPassword" component={ResetPassword} />
            <Redirect to="/dashboard" />
          </Switch>
        </AuthProvider>
      </SnackbarProvider>
    </Router>
  );
}

export default App;
