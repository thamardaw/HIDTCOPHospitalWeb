import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { CategoryDetail, CategoryForm, CategoryTable } from ".";

const Category = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}`} component={CategoryTable} exact />
      <Route path={`${path}/form/:id?`} component={CategoryForm} />
      <Route path={`${path}/details/:id`} component={CategoryDetail} />
      <Redirect to={`${path}`} />
    </Switch>
  );
};

export default Category;
