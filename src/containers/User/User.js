import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { UserDetail, UserForm, UserTable } from ".";

const User = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={UserTable} exact />
      <Route path={`${path}/form/:id?`} component={UserForm} />
      <Route path={`${path}/details/:id`} component={UserDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default User;
