import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../../hooks";
import { useEffect, useState } from "react";
import { BackButton } from "../../../components";

const UomDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({});

  const getData = async () => {
    const res = await api.get(`/api/uom/${parseInt(id)}`);
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
    <Box sx={{ flexGrow: 1 }}>
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Name
            </Typography>
          </Box>
          <Typography variant="body2">{details?.name}</Typography>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "10px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Description
            </Typography>
          </Box>
          <Box sx={{ width: "70%" }}>
            <Typography variant="body2">{details?.description}</Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "20px 10px",
        }}
      ></Box>
    </Box>
  );
};

export default UomDetail;
