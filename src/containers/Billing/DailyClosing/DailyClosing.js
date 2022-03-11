import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { DailyClosingDetail, DailyClosingForm, DailyClosingTable } from ".";

const DailyClosing = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={DailyClosingTable} exact />
      <Route path={`${path}/form/:id?`} component={DailyClosingForm} />
      <Route path={`${path}/details/:id`} component={DailyClosingDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default DailyClosing;
