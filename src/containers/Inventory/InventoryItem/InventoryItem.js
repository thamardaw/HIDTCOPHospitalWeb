import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { InventoryItemDetail, InventoryItemForm, InventoryItemTable } from ".";

const InventoryItem = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={InventoryItemTable} exact />
      <Route path={`${path}/form/:id?`} component={InventoryItemForm} />
      <Route path={`${path}/details/:id`} component={InventoryItemDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default InventoryItem;
