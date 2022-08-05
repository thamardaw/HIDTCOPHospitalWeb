import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory } from "react-router-dom";
import { BillFormPreview, BillSubForm } from "../../../components/bill";
import { BackButton } from "../../../components/common";
import { useResetRecoilState } from "recoil";
import billFormAtom from "../../../recoil/billForm";

const BillsForm = () => {
  const history = useHistory();
  const resetBillForm = useResetRecoilState(billFormAtom);

  return (
    <>
      <Toolbar
        sx={{
          display: "flex",
          paddingLeft: "12px",
        }}
        variant="dense"
        disableGutters={true}
      >
        <BackButton
          backFunction={() => {
            history.goBack();
            resetBillForm();
          }}
        />
        <Typography variant="h6" component="div">
          New Bill
        </Typography>
      </Toolbar>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          padding: "20px 10px",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
          }}
        >
          <BillSubForm />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "65%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <BillFormPreview />
        </Box>
      </Box>
    </>
  );
};

export default BillsForm;
