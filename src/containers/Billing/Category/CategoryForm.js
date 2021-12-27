import {
  Button,
  Divider,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../../hooks";
import React, { useEffect, useState } from "react";

const CategoryForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({
    name: "",
    description: "",
  });

  const getData = async () => {
    const res = await api.get(`/api/category/${parseInt(id)}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
  };

  const createNew = async () => {
    const res = await api.post(`/api/category/`, {
      ...details,
    });
    if (res.status === 200) {
      history.goBack();
    }
  };

  const update = async () => {
    const res = await api.put(`/api/category/${parseInt(id)}`, {
      name: details.name,
      description: details.description,
    });
    if (res.status === 200) {
      history.goBack();
    }
  };

  useEffect(() => {
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
        <IconButton
          sx={{
            color: "white",
            backgroundColor: "primary.main",
            borderRadius: "10%",
            "&:hover": {
              backgroundColor: "primary.light",
            },
            marginRight: "10px",
          }}
          onClick={() => history.goBack()}
          size="small"
        >
          <ArrowBackIosNewIcon size="small" />
        </IconButton>
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
            <Typography variant="p">Description</Typography>
          </Box>
          <TextField
            size="small"
            sx={{ width: "70%" }}
            margin="dense"
            value={details?.description || ""}
            onChange={(e) =>
              setDetails({ ...details, description: e.target.value })
            }
          />
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
        <Button
          variant="contained"
          size="small"
          sx={{ marginRight: "5px" }}
          onClick={id ? update : createNew}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;
