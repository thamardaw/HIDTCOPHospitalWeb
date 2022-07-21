import { Button, Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router";
import { useAxios } from "../../../hooks";
import { useEffect, useRef, useState } from "react";
import { generateID } from "../../../utils/generateID";
import { useReactToPrint } from "react-to-print";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import { BackButton } from "../../../components";
import { constants } from "../../../utils/constants";
import { DeleteDialog } from "../../../components";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "1.3rem",
  fontWeight: 500,
}));

const CategoryDetail = () => {
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});
  const [open, setOpen] = useState(false);
  const depositRef = useRef();

  const handleClose = () => {
    setOpen(false);
  };

  const cancelDeposit = async () => {
    await api.put(`/api/deposit/cancel/${id}`);
    handleClose();
    history.goBack();
  };

  const handlePrint = useReactToPrint({
    pageStyle:
      "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}",
    content: () => depositRef.current,
  });

  const getData = async () => {
    const res = await api.get(`/api/deposit/${id}`);
    if (res.status === 200) {
      setDetails({ ...res.data });
    } else {
      history.goBack();
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
    <>
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
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Details
          </Typography>
          <Button variant="contained" size="small" onClick={handlePrint}>
            Print
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{
              marginLeft: "5px",
              display: location.state?.from === "active" ? "block" : "none",
            }}
            onClick={() => setOpen(true)}
          >
            Cancel
          </Button>
        </Toolbar>
        <Divider />
        <Box ref={depositRef} sx={{ display: "bock" }}>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ marginTop: "20px" }}
          >
            {constants.name_long}
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ fontWeight: "500", fontSize: "16px" }}
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
                <StyledTypography variant="body2">Date</StyledTypography>
              </Box>
              <StyledTypography variant="body2">
                {details?.created_time && details.created_time.split("T")[0]}
              </StyledTypography>
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
                <StyledTypography variant="body2">Deposit ID</StyledTypography>
              </Box>
              <StyledTypography variant="body2">
                {details?.id && generateID(details.id)}
              </StyledTypography>
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
                <StyledTypography variant="body2">Patient ID</StyledTypography>
              </Box>
              <StyledTypography variant="body2">
                {details?.patient_id &&
                  generateID(details?.patient_id, details.patient.created_time)}
              </StyledTypography>
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
                <StyledTypography variant="body2">
                  Patient Name
                </StyledTypography>
              </Box>
              <StyledTypography variant="body2">
                {details?.patient && details.patient.name}
              </StyledTypography>
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
                <StyledTypography variant="body2">
                  Patient Phone
                </StyledTypography>
              </Box>
              <Box sx={{ width: "70%" }}>
                <StyledTypography variant="body2">
                  {details?.patient && details.patient.contact_details}
                </StyledTypography>
              </Box>
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
                <StyledTypography variant="body2">
                  Patient Address
                </StyledTypography>
              </Box>
              <Box sx={{ width: "70%" }}>
                <StyledTypography variant="body2">
                  {details?.patient && details.patient.address}
                </StyledTypography>
              </Box>
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
                <StyledTypography variant="body2">Amount</StyledTypography>
              </Box>
              <Box sx={{ width: "70%" }}>
                <StyledTypography variant="body2">
                  {details?.amount} MMK
                </StyledTypography>
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
            <StyledTypography variant="body2" >
              Patient ID
            </StyledTypography>
          </Box>
          <StyledTypography variant="body2">
            {details?.patient_id &&
              generateID(details?.patient_id, details.patient.created_time)}
          </StyledTypography>
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
            <StyledTypography variant="body2" >
              Patient Name
            </StyledTypography>
          </Box>
          <StyledTypography variant="body2">
            {details?.patient && details.patient.name}
          </StyledTypography>
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
            <StyledTypography variant="body2" >
              Amount
            </StyledTypography>
          </Box>
          <Box sx={{ width: "70%" }}>
            <StyledTypography variant="body2">{details?.amount}</StyledTypography>
          </Box>
        </Box>
      </Box> */}
        <Divider />
      </Box>
      {/* <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel the deposit?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={cancelDeposit} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog> */}
      <DeleteDialog
        isOpen={open}
        handleClose={() => handleClose()}
        callbackButtonName="OK"
        content="You are about to cancel the deposit."
        callback={() => {
          cancelDeposit();
        }}
      />
    </>
  );
};

export default CategoryDetail;
