import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { DepositDetail, DepositTable, DepositForm } from ".";

const Deposit = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={DepositTable} exact />
      <Route path={`${path}/form/:id?`} component={DepositForm} />
      <Route path={`${path}/details/:id`} component={DepositDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default Deposit;
