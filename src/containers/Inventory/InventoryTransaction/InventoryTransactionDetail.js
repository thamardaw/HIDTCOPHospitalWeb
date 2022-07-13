import { Box, Divider, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { BackButton, DetailsRow } from "../../../components";
import { useAxios } from "../../../hooks";

const InventoryTransactionDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});

  const getData = async () => {
    const res = await api.get(`/api/inventory_transactions/${parseInt(id)}`);
    if (res.status === 200) {
      setDetails(res.data);
    }
    return;
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

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
          name="Inventory Item Name"
          value={details?.inventory_item_name}
        />
        <DetailsRow name="Batch" value={details?.inventory_item?.batch} />
        <DetailsRow
          name="Transaction Type"
          value={details?.transaction_type_name}
        />
        <DetailsRow name="Quantity" value={details?.quantity} />
        <DetailsRow name="Unit" value={details?.unit} />
        <DetailsRow name="Opening Balance" value={details?.opening_balance} />
        <DetailsRow name="Closing Balance" value={details?.closing_balance} />
        <DetailsRow name="Selling Price" value={details?.selling_price} />
        <DetailsRow name="Note" value={details?.note} />
      </Box>
    </Box>
  );
};

export default InventoryTransactionDetail;
