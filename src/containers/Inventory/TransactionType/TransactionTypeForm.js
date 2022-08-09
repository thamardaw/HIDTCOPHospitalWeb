import {
  Button,
  Divider,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router";
import React, { useEffect, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAxios } from "../../../hooks";
import { BackButton,CSVUploadDialog } from "../../../components/common";

const TransactionTypeForm = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    name: "",
    type: "",
  });
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const getData = async () => {
    const res = await api.get(`/api/transaction_types/${parseInt(id)}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
    }
  };

  const createNew = async () => {
    setLoading(true);
    const res = await api.post(`/api/transaction_types/`, {
      ...details,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  const update = async () => {
    setLoading(true);
    const res = await api.put(`/api/transaction_types/${parseInt(id)}`, {
      name: details.name,
      type: details.type,
    });
    if (res.status === 200) {
      history.goBack();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getData();
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
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
              name="name"
              onChange={handleChange}
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
              <Typography variant="p">Type</Typography>
            </Box>
            <TextField
              select
              fullWidth
              label="Type"
              size="small"
              sx={{ width: "70%" }}
              margin="dense"
              value={details?.type || ""}
              name="type"
              onChange={handleChange}
            >
              <MenuItem value="receive">Receive</MenuItem>
              <MenuItem value="issue">Issue</MenuItem>
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
          <Button
            variant="outlined"
            size="small"
            sx={{ marginRight: "5px", display: id ? "none" : "block" }}
            onClick={handleOpenDialog}
          >
            Upload
          </Button>
          <LoadingButton
            variant="contained"
            loading={loading}
            size="small"
            sx={{ marginRight: "5px" }}
            onClick={id ? update : createNew}
          >
            Save
          </LoadingButton>
        </Box>
      </Box>
      <CSVUploadDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        columns={["name", "type"]}
        example_rows={[
          {
            name: "Please don't touch row 1 and look at row 3 for field description and example values. Columns with comma seperated values are the only valid value for those field. REMOVE ROW 2 AND 3 BEFORE UPLOADING.",
          },
          {
            name: "Name of Transaction Type",
            type: "issue,receive",
          },
        ]}
        endpoint="/api/transaction_types/bulk_create"
        template_file_name="transaction_type_template.csv"
      />
    </>
  );
};

export default TransactionTypeForm;
