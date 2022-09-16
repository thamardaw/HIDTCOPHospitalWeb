import { Redirect, Route, useRouteMatch, Switch } from "react-router";
import { useRecoilValue } from "recoil";
import { CategoryDetail, CategoryForm, CategoryTable } from ".";
import { withUser } from "../../../recoil/auth";

const Category = () => {
  const { path } = useRouteMatch();
  const user = useRecoilValue(withUser);
  if (!["Admin"].includes(user.role)) return <Redirect to={"/"} />;
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
