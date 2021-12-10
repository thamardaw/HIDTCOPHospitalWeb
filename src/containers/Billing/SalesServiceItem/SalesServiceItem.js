import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import {
  SalesServiceItemDetail,
  SalesServiceItemForm,
  SalesServiceItemTable,
} from ".";

const SalesServiceItem = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={SalesServiceItemTable} exact />
      <Route path={`${path}/form/:id?`} component={SalesServiceItemForm} />
      <Route path={`${path}/details/:id`} component={SalesServiceItemDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default SalesServiceItem;
