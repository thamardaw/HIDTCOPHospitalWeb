import { Box, Divider, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton, DetailsRow } from "../../../components";
import { useAxios } from "../../../hooks";

const InventoryItemDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});

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
        <DetailsRow name="Brand Name" value={details?.brand_name} />
        <Divider />
        <DetailsRow name="Generic Name" value={details?.generic_name} />
        <Divider />
        <DetailsRow name="Balance" value={details?.balance} />
        <Divider />
        <DetailsRow name="Unit" value={details?.unit} />
        <Divider />
        <DetailsRow name="Expiry Date" value={details?.expiry_date} />
        <Divider />
        <DetailsRow name="Batch" value={details?.batch} />
        <Divider />
        <DetailsRow name="Purchasing Price" value={details?.purchasing_price} />
        <Divider />
        <DetailsRow name="Selling Price" value={details?.selling_price} />
      </Box>
      <Divider />
    </Box>
  );
};

export default InventoryItemDetail;
