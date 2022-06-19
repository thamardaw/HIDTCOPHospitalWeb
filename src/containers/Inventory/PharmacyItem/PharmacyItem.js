import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { PharmacyItemDetail, PharmacyItemForm, PharmacyItemTable } from ".";

const PharmacyItem = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={PharmacyItemTable} exact />
      <Route path={`${path}/form/:id?`} component={PharmacyItemForm} />
      <Route path={`${path}/details/:id`} component={PharmacyItemDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default PharmacyItem;
