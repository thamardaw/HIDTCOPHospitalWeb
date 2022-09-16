import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../hooks";
import { useEffect, useState } from "react";
import { BackButton, DetailsRow } from "../../components/common";

const UserDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});

  const getData = async () => {
    const res = await api.get(`/api/user/${id}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    } else {
      history.goBack();
    }
    // eslint-disable-next-line
  }, [id]);
  return (
    <Box sx={{ flexGrow: 1, mb: 1 }}>
      <Toolbar
        sx={{
          display: "flex",
          paddingLeft: "12px",
        }}
        variant="dense"
        disableGutters={true}
      >
        <BackButton backFunction={() => history.goBack()} />
        <Typography variant="h5">Details</Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
        <DetailsRow name="Username" value={details?.username} />
        <DetailsRow name="Role" value={details?.role} />
      </Box>
    </Box>
  );
};

export default UserDetail;
