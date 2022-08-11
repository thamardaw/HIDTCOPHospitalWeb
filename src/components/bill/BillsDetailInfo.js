import { Box, Typography } from "@mui/material";
import { constants } from "../../utils/constants";
import { styled } from "@mui/material/styles";
import { generateID } from "../../utils/generateID";
import { useEffect, useState } from "react";

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "1.2rem",
  fontWeight: 650,
}));

const CustomDivider = styled(Box)(({ theme }) => ({
  // borderBottom: "2px solid black",
  margin: "10px 0px",
}));

const BillsDetailInfo = ({
  bill,
  payment,
  stage,
  isClinic,
  totalDeposit,
  children,
}) => {
  const [dateState, setDateState] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setDateState(new Date()), 30000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <Box sx={{ my: "15px" }}>
        <StyledTypography variant="h6" textAlign="center">
          {constants.name_long}
        </StyledTypography>
        <Box sx={{ flexDirection: "column", paddingTop: "15px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              margin: "10px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <StyledTypography variant="body">Bill ID</StyledTypography>
            </Box>
            <StyledTypography variant="body">
              {bill?.id && generateID(bill?.id)}
            </StyledTypography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              margin: "10px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <StyledTypography variant="body">Date & Time</StyledTypography>
            </Box>
            <StyledTypography variant="body">
              {dateState.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              {dateState.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </StyledTypography>
          </Box>
          <Box
            sx={{
              display: stage === "completed" ? "flex":"none",
              flexDirection: "row",
              alignItems: "flex-start",
              margin: "10px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <StyledTypography variant="body">Payment Date & Time</StyledTypography>
            </Box>
            <StyledTypography variant="body">
              {payment?.updated_time && new Date(payment.updated_time).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              {payment?.updated_time && new Date(payment.updated_time).toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </StyledTypography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              margin: "10px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <StyledTypography variant="body">Patient ID</StyledTypography>
            </Box>
            <StyledTypography variant="body">
              {bill?.patient &&
                generateID(bill?.patient.id, bill?.patient.created_time)}
            </StyledTypography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              margin: "10px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <StyledTypography variant="body">Name</StyledTypography>
            </Box>
            <StyledTypography variant="body">
              {bill?.patient_name}
            </StyledTypography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              margin: "10px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <StyledTypography variant="body">Phone</StyledTypography>
            </Box>
            <StyledTypography variant="body">
              {bill?.patient_phone}
            </StyledTypography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              margin: "10px 0px",
            }}
          >
            <Box sx={{ width: "30%" }}>
              <StyledTypography variant="body">Address</StyledTypography>
            </Box>
            <Box sx={{ width: "70%" }}>
              <StyledTypography variant="body">
                {bill?.patient_address}
              </StyledTypography>
            </Box>
          </Box>
        </Box>
      </Box>
      {children}
      <Box sx={{ marginTop: "10px", marginRight: "16px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <StyledTypography variant="body" sx={{ fontSize: "28px" }}>
            Total
          </StyledTypography>
          <StyledTypography variant="body" sx={{ fontSize: "28px" }}>
            {bill?.total_amount}
          </StyledTypography>
        </Box>
        <CustomDivider />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <StyledTypography variant="body" sx={{ fontSize: "28px" }}>
            Deposit
          </StyledTypography>
          <StyledTypography variant="body" sx={{ fontSize: "28px" }}>
            {stage === "draft" && totalDeposit}
            {(stage === "outstanding" || stage === "completed") &&
              payment?.total_deposit_amount}
            {stage === "cancelled" && "0"}
          </StyledTypography>
        </Box>
        <CustomDivider />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <StyledTypography variant="body" sx={{ fontSize: "28px" }}>
            Unpaid
          </StyledTypography>
          <StyledTypography variant="body" sx={{ fontSize: "28px" }}>
            {stage === "draft" && parseInt(bill?.total_amount) - totalDeposit}
            {(stage === "outstanding" || stage === "completed") &&
              payment?.unpaid_amount}
            {stage === "cancelled" && bill?.total_amount}
          </StyledTypography>
        </Box>
        <CustomDivider />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <StyledTypography variant="body">Created By</StyledTypography>
          <StyledTypography variant="body">
            {bill?.created_user?.username}
          </StyledTypography>
        </Box>
      </Box>
    </>
  );
};

export default BillsDetailInfo;
