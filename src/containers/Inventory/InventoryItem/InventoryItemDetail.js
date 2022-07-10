import { Box, Divider, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton, DetailsRow } from "../../../components";
import { useAxios } from "../../../hooks";

const InventoryItemDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});

  const getData = async () => {
    const res = await api.get(`/api/inventory_items/${parseInt(id)}`);
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
          name="Brand Name"
          value={details?.pharmacy_item?.brand_name}
        />
        <DetailsRow
          name="Generic Name"
          value={details?.pharmacy_item?.generic_name}
        />
        <DetailsRow name="Name" value={details?.name} />
        <DetailsRow name="Balance" value={details?.balance} />
        <DetailsRow name="Unit" value={details?.unit} />
        <DetailsRow name="Expiry Date" value={details?.expiry_date} />
        <DetailsRow name="Batch" value={details?.batch} />
        <DetailsRow name="Purchasing Price" value={details?.purchasing_price} />
        <DetailsRow
          name="Sales Item"
          value={details?.sales_service_item?.name}
        />
      </Box>
    </Box>
  );
};

export default InventoryItemDetail;
