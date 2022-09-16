import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton, DetailsRow } from "../../../components/common";
import { useAxios } from "../../../hooks";

const PharmacyItemDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});

  const getData = async () => {
    const res = await api.get(`/api/pharmacy_items/${parseInt(id)}`);
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
        <DetailsRow name="Category" value={details?.category?.name} />
        <DetailsRow name="Brand Name" value={details?.brand_name} />
        <DetailsRow name="Generic Name" value={details?.generic_name} />
        <DetailsRow name="Form" value={details?.form} />
        <DetailsRow name="Strength" value={details?.strength} />
        <DetailsRow name="PO-unit" value={details?.po_unit} />
        <DetailsRow name="Unit" value={details?.unit} />
        <DetailsRow name="Unit Conversion" value={details?.converstion_rate} />
      </Box>
    </Box>
  );
};

export default PharmacyItemDetail;
