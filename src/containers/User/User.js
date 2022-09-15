import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { useRecoilValue } from "recoil";
import { UserDetail, UserForm, UserTable } from ".";
import { withUser } from "../../recoil/auth";

const User = () => {
  const { path } = useRouteMatch();
  const user = useRecoilValue(withUser);
  if (["Admin"].includes(user.role)) return <Redirect to={"/"} />;
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
