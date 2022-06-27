import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import {
  InventoryTransactionDetail,
  InventoryTransactionForm,
  InventoryTransactionTable,
} from ".";

const InventoryTransaction = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={InventoryTransactionTable} exact />
      <Route path={`${path}/form/:id?`} component={InventoryTransactionForm} />
      <Route
        path={`${path}/details/:id`}
        component={InventoryTransactionDetail}
      />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default InventoryTransaction;
