import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../hooks";
import { useEffect, useState } from "react";
import { generateID } from "../../utils/generateID";
import { BackButton, DetailsRow } from "../../components";

const PatientDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({});

  const getData = async () => {
    const res = await api.get(`/api/patients/${parseInt(id.split("-")[1])}`);
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
        <DetailsRow
          name="ID"
          value={details?.id && generateID(details.id, details.created_time)}
        />
        <Divider />
        <DetailsRow name="Name" value={details?.name} />
        <Divider />
        <DetailsRow name="Age" value={details?.age} />
        <Divider />
        <DetailsRow name="Contact Details" value={details?.contact_details} />
        <Divider />
        <DetailsRow name="Gender" value={details?.gender} />
        <Divider />
        <DetailsRow name="Date Of Birth" value={details.date_of_birth} />
        <Divider />
        <DetailsRow name="Address" value={details?.address} />
      </Box>
      <Divider />
    </Box>
  );
};

export default PatientDetail;
