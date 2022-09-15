import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { useRecoilValue } from "recoil";
import { UomDetail, UomForm, UomTable } from ".";
import { withUser } from "../../../recoil/auth";

const Uom = () => {
  const { path } = useRouteMatch();
  const user = useRecoilValue(withUser);
  if (["Admin"].includes(user.role)) return <Redirect to={"/"} />;
  return (
    <Switch>
      <Route path={`${path}`} component={UomTable} exact />
      <Route path={`${path}/form/:id?`} component={UomForm} />
      <Route path={`${path}/details/:id`} component={UomDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default Uom;
