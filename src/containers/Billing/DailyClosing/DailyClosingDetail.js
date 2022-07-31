import { Button, Divider, Toolbar, Typography } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../../../hooks";
import { generateID } from "../../../utils/generateID";
import { useReactToPrint } from "react-to-print";
import { BackButton, DetailsRow } from "../../../components";
import DailyClosingBillTable from "../../../components/DailyClosingBillTable";
import DailyClosingDepositTable from "../../../components/DailyClosingDepositTable";

const DailyClosingDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});
  const [bills, setBills] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const dailyClosingRef = useRef();

  const handlePrint = useReactToPrint({
    pageStyle:
      "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin: 200mm !important }}",
    content: () => dailyClosingRef.current,
  });

  const getData = async () => {
    const res = await api.get(`/api/dailyClosing/${id}`);
    if (res.status === 200) {
      setDetails(res.data);
      const b = res.data.bills.map((row) => {
        const ID = generateID(row.patient.id, row.patient.created_time);
        return {
          id: row.id,
          bill_id: row.id,
          patient_id: ID,
          patient_name: row.patient.name,
          total_amount: row.payment[0].total_amount,
          deposit_amount: row.payment[0].total_deposit_amount,
          collected_amount: row.payment[0].collected_amount,
        };
      });
      setBills(b);
      const d = res.data.deposits.map((row) => {
        const ID = generateID(row.patient.id, row.patient.created_time);
        return {
          id: row.id,
          deposit_id: row.id,
          patient_id: ID,
          patient_name: row.patient.name,
          deposit_amount: row.amount,
        };
      });
      setDeposits(d);
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
    <Box sx={{ width: "100%", mb: 1 }}>
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
          Detail
        </Typography>
        <Button variant="contained" size="small" onClick={handlePrint}>
          Print
        </Button>
      </Toolbar>
      <Divider />
      <Box
        sx={{ flexDirection: "column", padding: "20px 10px" }}
        ref={dailyClosingRef}
      >
        <DetailsRow
          name="In Charge Name"
          value={details?.created_user?.username}
          textVariant="p"
        />
        <Divider />
        <DetailsRow
          name="Opening Balance"
          value={details?.opening_balance}
          textVariant="p"
        />
        <DailyClosingBillTable data={bills} />
        <DailyClosingDepositTable data={deposits} />
        <DetailsRow name="Total" value={details?.grand_total} textVariant="p" />
        <Divider />
        <DetailsRow
          name="Actual Amount"
          value={details?.actual_amount}
          textVariant="p"
        />
        <Divider />
        <DetailsRow
          name="Adjustment"
          value={details?.adjusted_amount}
          textVariant="p"
        />
        <Divider />
        <DetailsRow
          name="Remark"
          value={details?.adjusted_reason}
          textVariant="p"
        />
      </Box>
    </Box>
  );
};

export default DailyClosingDetail;
