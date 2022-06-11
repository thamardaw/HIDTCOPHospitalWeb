import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
// import { useState } from "react";
// import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton, DetailsRow } from "../../../components";
// import { useAxios } from "../../../hooks";

const PharmacyItemDetail = () => {
  const history = useHistory();
  // const { id } = useParams();
  // const api = useAxios({ autoSnackbar: true });
  // const [details, setDetails] = useState({});
  const details = {};

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
        <DetailsRow name="Category" value={details?.category} />
        <Divider />
        <DetailsRow name="Brand Name" value={details?.brand_name} />
        <Divider />
        <DetailsRow name="Generic Name" value={details?.generic_name} />
        <Divider />
        <DetailsRow name="Form" value={details?.form} />
        <Divider />
        <DetailsRow name="Strength" value={details?.strength} />
        <Divider />
        <DetailsRow name="PO-unit" value={details?.po_unit} />
        <Divider />
        <DetailsRow name="Unit" value={details?.unit} />
        <Divider />
        <DetailsRow name="Unit Converrion" value={details?.unit_converrion} />
      </Box>
      <Divider />
    </Box>
  );
};

export default PharmacyItemDetail;
