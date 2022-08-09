import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import {
  TransactionTypeDetail,
  TransactionTypeForm,
  TransactionTypeTable,
} from ".";

const TransactionType = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={TransactionTypeTable} exact />
      <Route path={`${path}/form/:id?`} component={TransactionTypeForm} />
      <Route path={`${path}/details/:id`} component={TransactionTypeDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default TransactionType;
