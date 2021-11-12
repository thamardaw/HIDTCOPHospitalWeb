import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { PatientDetail, PatientForm, PatientTable } from ".";

const Patient = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={PatientTable} exact />
      <Route path={`${path}/form/:id?`} component={PatientForm} />
      <Route path={`${path}/details/:id`} component={PatientDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default Patient;
