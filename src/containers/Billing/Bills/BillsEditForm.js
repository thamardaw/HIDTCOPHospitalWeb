import { Divider, Toolbar, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useHistory, useParams } from "react-router-dom";
import { useAxios } from "../../../hooks";
import { useState, useEffect } from "react";
import { getComparator, stableSort } from "../../../utils/sorting";
import { BackButton } from "../../../components/common";
import { BillEditFormPreview, BillEditSubForm } from "../../../components/bill";

// function sleep(delay = 0) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, delay);
//   });
// }

const BillsEditForm = () => {
  const history = useHistory();
  const api = useAxios({ autoSnackbar: true });
  const { id } = useParams();
  const [details, setDetails] = useState({});
  const [dispensedItems, setDispensedItems] = useState([]);
  const [totalDeposit, setTotalDeposit] = useState(0);

  const isDispensed = (row) => {
    return Boolean(
      dispensedItems.find(function (dt, index) {
        if (parseInt(dt.note.split(",")[1]) === row.id) {
          return true;
        }
        return false;
      })
    );
  };

  const getDepositByPatientId = async (id) => {
    const res = await api.get(`/api/deposit/active/${parseInt(id)}`);
    if (res.status === 200) {
      const total = res.data.reduce((total, num) => total + num.amount, 0);
      setTotalDeposit(total);
    }
  };

  const getData = async () => {
    const [bill, invtxs] = await Promise.all([
      api.get(`/api/bill/${id}`),
      api.get(`/api/inventory/dispense/${id}`),
    ]);
    if (bill.status === 200 && invtxs.status === 200) {
      getDepositByPatientId(bill.data.patient.id);
      setDetails({
        ...bill.data,
        bill_items: stableSort(
          bill.data.bill_items,
          getComparator("desc", "id")
        ),
      });
      setDispensedItems(invtxs.data);
    } else {
      history.goBack();
    }
    return;
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [id]);

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
        <BackButton backFunction={() => history.goBack()} />
        <Typography variant="h6" component="div">
          Edit Bill
        </Typography>
      </Toolbar>
      <Divider />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "column", md: "row" },
          alignItems: "flex-start",
          padding: "20px 10px",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
          }}
        >
          <BillEditSubForm id={id} getData={getData} />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "65%" },
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <BillEditFormPreview
            id={id}
            data={details}
            getData={getData}
            isDispensed={isDispensed}
            totalDeposit={totalDeposit}
          />
        </Box>
      </Box>
    </>
  );
};

export default BillsEditForm;
