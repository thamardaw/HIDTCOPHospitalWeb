import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Login, Signup, Dashboard } from "./pages";

function App() {
  // function parseJwt(token) {
  //   var base64Url = token.split(".")[1];
  //   var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //   var jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split("")
  //       .map(function (c) {
  //         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  //       })
  //       .join("")
  //   );

  //   return JSON.parse(jsonPayload);
  // }
  // console.log(
  //   parseJwt(
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ6YXkiLCJyb2xlIjoic3RyaW5nIiwiZXhwIjoxNjM1MjUxNTc2fQ.JWOmIy7J3m8IvguUBjYoARRl684Z6n4RSqHlts9lDO8"
  //   )
  // );
  return (
    <Router>
      <Switch>
        <Route path="/" component={Dashboard} exact />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
      </Switch>
    </Router>
  );
}

export default App;
