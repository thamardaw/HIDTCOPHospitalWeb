import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { PaymentTypeDetail, PaymentTypeForm, PaymentTypeTable } from ".";

const PaymentType = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={PaymentTypeTable} exact />
      <Route path={`${path}/form/:id?`} component={PaymentTypeForm} />
      <Route path={`${path}/details/:id`} component={PaymentTypeDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  )
}

export default PaymentType