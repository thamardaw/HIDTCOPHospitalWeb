import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { PaymentDetail, PaymentTable } from ".";

const Payment = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={PaymentTable} exact />
      {/* <Route path={`${path}/form/:id?`} component={PaymentForm} /> */}
      <Route path={`${path}/details/:id`} component={PaymentDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default Payment;
