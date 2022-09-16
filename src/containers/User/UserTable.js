import { Button } from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomTable } from "../../components/common";
import { useAxios } from "../../hooks";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    label: "Username",
  },
  {
    id: "role",
    numeric: false,
    disablePadding: false,
    label: "Role",
  },
];
const UserTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = useCallback(async () => {
    setIsTableLoading(true);
    const res = await api.get("/api/user/");
    if (res.status === 200) {
      setRows(res.data);
      setIsTableLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <CustomTable
      tableConfig={{
        headCells: headCells,
        tableName: "User",
        maxHeight: "62vh",
        atom: "userTableAtom",
      }}
      data={rows}
      isLoading={isTableLoading}
      toolbarButtons={{
        whenNoneSelected: [
          {
            id: "user table new button",
            component: memo(({ ...rest }) => (
              <Button variant="outlined" size="small" {...rest}>
                New
              </Button>
            )),
            callback: (selected) => {
              history.push("user/form");
            },
          },
        ],
        whenOneSelected: [
          {
            id: "user table edit button",
            component: memo(({ ...rest }) => (
              <Button variant="contained" size="small" {...rest}>
                Edit
              </Button>
            )),
            callback: (selected) => {
              history.push(`user/form/${selected[0].id}`);
            },
          },
          {
            id: "user table detail button",
            component: memo(({ ...rest }) => (
              <Button
                variant="contained"
                size="small"
                sx={{ marginLeft: "5px" }}
                {...rest}
              >
                Details
              </Button>
            )),
            callback: (selected) => {
              history.push(`user/details/${selected[0].id}`);
            },
          },
        ],
        whenMoreThanOneSelected: [],
      }}
    />
  );
};

export default UserTable;
