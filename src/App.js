import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login, Signup } from "./pages";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
