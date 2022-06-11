import { Box, Divider, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton, DetailsRow } from "../../../components";
import { useAxios } from "../../../hooks";

const TransactionTypeDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});

  const getData = async () => {
    const res = await api.get(`/api/transaction_types/${parseInt(id)}`);
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
        <DetailsRow name="Name" value={details?.name} />
        <Divider />
        <DetailsRow name="Type" value={details?.type} />
      </Box>
      <Divider />
    </Box>
  );
};

export default TransactionTypeDetail;
