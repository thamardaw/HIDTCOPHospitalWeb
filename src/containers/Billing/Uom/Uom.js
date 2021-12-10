import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { UomDetail, UomForm, UomTable } from ".";

const Uom = () => {
  const { path } = useRouteMatch();
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
