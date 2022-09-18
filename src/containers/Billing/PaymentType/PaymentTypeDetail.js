import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { BackButton, DetailsRow } from "../../../components/common";
import { useAxios } from "../../../hooks";

const PaymentTypeDetail = () => {
  const { id } = useParams();
  const history = useHistory();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});


  const getData = async () => {
    const res = await api.get(`/api/payment_types/${parseInt(id)}`);
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
    //eslint-disable-next-line
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
      <Box sx={{ flexDireaction: "column", padding: "20px 10px" }}>
        <DetailsRow name="Name" value={details?.name} />
        <DetailsRow name="Is Default" value={details?.is_default} />
      </Box>
    </Box>
  );
};

export default PaymentTypeDetail