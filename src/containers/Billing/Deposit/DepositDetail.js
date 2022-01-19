import {
  Button,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../../hooks";
import { useEffect, useRef, useState } from "react";
import { generateID } from "../../../utils/generateID";
import { useReactToPrint } from "react-to-print";

const CategoryDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios();
  const [details, setDetails] = useState({});
  const depositRef = useRef();

  const handlePrint = useReactToPrint({
    pageStyle:
      "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}",
    content: () => depositRef.current,
  });

  const getData = async () => {
    const res = await api.get(`/api/deposit/${parseInt(id)}`);
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
        <Typography variant="h5" sx={{ flexGrow: 1 }}>
          Details
        </Typography>
        <Button variant="contained" size="small" onClick={handlePrint}>
          Print
        </Button>
      </Toolbar>
      <Divider />
      <Box ref={depositRef} sx={{ display: "bock" }}>
        <Typography variant="h6" textAlign="center" sx={{ marginTop: "20px" }}>
          Dagon Lin Hospital
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ fontWeight: "100", fontSize: "16px" }}
        >
          Receipt
        </Typography>
        <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "20px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Date
              </Typography>
            </Box>
            <Typography variant="body2">
              {details?.created_time && details.created_time.split("T")[0]}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "20px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Deposit ID
              </Typography>
            </Box>
            <Typography variant="body2">{details?.id && details.id}</Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "20px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Patient ID
              </Typography>
            </Box>
            <Typography variant="body2">
              {details?.patient_id &&
                generateID(details?.patient_id, details.patient.created_time)}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "20px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Patient Name
              </Typography>
            </Box>
            <Typography variant="body2">
              {details?.patient && details.patient.name}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              margin: "20px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Amount
              </Typography>
            </Box>
            <Box sx={{ width: "70%" }}>
              <Typography variant="body2">{details?.amount}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* <Box sx={{ flexDirection: "column", padding: "20px 10px" }}>
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
              Patient ID
            </Typography>
          </Box>
          <Typography variant="body2">
            {details?.patient_id &&
              generateID(details?.patient_id, details.patient.created_time)}
          </Typography>
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
              Patient Name
            </Typography>
          </Box>
          <Typography variant="body2">
            {details?.patient && details.patient.name}
          </Typography>
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
              Amount
            </Typography>
          </Box>
          <Box sx={{ width: "70%" }}>
            <Typography variant="body2">{details?.amount}</Typography>
          </Box>
        </Box>
      </Box> */}
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

export default CategoryDetail;
