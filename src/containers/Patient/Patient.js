import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { PatientCreate, PatientDetail, PatientEdit, PatientTable } from ".";

const Patient = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={PatientTable} exact />
      <Route path={`${path}/create`} component={PatientCreate} />
      <Route path={`${path}/edit`} component={PatientEdit} />
      <Route path={`${path}/detail`} component={PatientDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default Patient;
