import {
  Divider,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../../hooks";
import React, { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { BackButton } from "../../../components";

const SalesServiceItemForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({
    name: "",
    price: "",
    uom_id: null,
    category_id: null,
  });
  const [uom, setUom] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const getUOMAndCategory = async () => {
    const [uom, category] = await Promise.all([
      api.get("/api/uom/"),
      api.get("/api/category/"),
    ]);
    if (uom.status === 200 && category.status === 200) {
      setUom(uom.data);
      setCategory(category.data);
    } else {
      history.goBack();
    }
  };

  const getData = async () => {
    const res = await api.get(`/api/salesServiceItem/${parseInt(id)}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
  };

  const createNew = async () => {
    setLoading(true);
    const res = await api.post(`/api/salesServiceItem/`, {
      ...details,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  const update = async () => {
    setLoading(true);
    const res = await api.put(`/api/salesServiceItem/${parseInt(id)}`, {
      name: details.name,
      price: details.price,
      uom_id: details.uom_id,
      category_id: details.category_id,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  useEffect(() => {
    getUOMAndCategory();
    if (id) {
      getData();
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
        <Typography variant="h5">{id ? "Edit" : "New"}</Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Name</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.name || ""}
            onChange={(e) => setDetails({ ...details, name: e.target.value })}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Price</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.price || ""}
            onChange={(e) => setDetails({ ...details, price: e.target.value })}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">UOM</Typography>
          </Box>
          <TextField
            select
            fullWidth
            label="UOM"
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.uom_id || ""}
            onChange={(e) => setDetails({ ...details, uom_id: e.target.value })}
          >
            {uom.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography variant="p">Category</Typography>
          </Box>
          <TextField
            select
            fullWidth
            label="Category"
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.category_id || ""}
            onChange={(e) =>
              setDetails({ ...details, category_id: e.target.value })
            }
          >
            {category.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
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
      >
        <LoadingButton
          loading={loading}
          variant="contained"
          size="small"
          sx={{ marginRight: "5px" }}
          onClick={id ? update : createNew}
        >
          Save
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default SalesServiceItemForm;
