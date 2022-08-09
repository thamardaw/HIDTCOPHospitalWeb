import { Button, Container, Toolbar } from "@mui/material";
import { useHistory, useParams } from "react-router-dom";
import { Box } from "@mui/system";
import { useEffect, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useAxios } from "../../../hooks";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BillItemsTable, BillsDetailInfo } from "../../../components/bill";
import { BackButton, DeleteDialog } from "../../../components/common";

const BillsDetail = () => {
  const api = useAxios({ autoSnackbar: true });
  const apiNoSnackbar = useAxios({ autoSnackbar: false });
  const history = useHistory();
  const location = useLocation();
  const receiptRef = useRef();
  const { id, stage } = useParams();
  const [showPay, setShowPay] = useState(false);
  const [bill, setBill] = useState({});
  const [dispensedItems, setDispensedItems] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [payment, setPayment] = useState({});
  const [totalDeposit, setTotalDeposit] = useState(0);
  const [open, setOpen] = useState(false);

  const [isPrintMode, setIsPrintMode] = useState(false);

  const handlePrint = useReactToPrint({
    pageStyle:
      "@media print { body { -webkit-print-color-adjust: economy; } @page { size: auto; margin: 0mm !important }}",
    content: () => receiptRef.current,
    onAfterPrint: () => {
      setIsPrintMode(false);
      // if (stage === "draft") {
      //   to_print();
      // }
    },
  });

  const cancelBill = async () => {
    if (bill) {
      const [b, inv] = await Promise.all([
        api.put(`/api/bill/cancel/${id}`),
        api.post("/api/inventory/returns", [...bill?.bill_items]),
      ]);
      if (b.status === 200 && inv.status === 200) {
        setOpen(false);
        history.goBack();
      }
    }
  };

  const getDepositByPatientId = async (id) => {
    const res = await api.get(`/api/deposit/active/${id}`);
    if (res.status === 200) {
      const total = res.data.reduce((total, num) => total + num.amount, 0);
      setTotalDeposit(total);
    }
  };

  const getBill = async () => {
    const res = await api.get(`/api/bill/${parseInt(id)}`);
    if (res.status === 200) {
      getDepositByPatientId(res.data.patient.id);
      setBill({ ...res.data });
      if (res.data.payment.length !== 0 && res.data.is_cancelled === false) {
        setPayment({ ...res.data.payment[0] });
        setShowPay(res.data.payment[0].is_outstanding);
      }
      // group_bill_items(res.data.bill_items);
    } else {
      history.goBack();
    }
    return;
  };

  const get_dispensed_items = async () => {
    const res = await api.get(`/api/inventory/dispense/${id}`);
    if (res.status === 200) {
      setDispensedItems(res.data);
    }
  };

  const get_inventory_items = async () => {
    const res = await apiNoSnackbar.post("/api/inventory/", [
      ...bill?.bill_items,
    ]);
    if (res.status === 200) {
      setInventoryItems(res.data);
    }
  };

  const make_payment = async () => {
    if (bill) {
      const res = await api.put(`/api/payment/${parseInt(payment.id)}`);
      if (res.status === 200) {
        history.replace({
          pathname: `/dashboard/bills/details/${id}/completed`,
          state: {
            from: "bill_process",
          },
        });
      }
    }
    return;
  };

  const finalize = async () => {
    const res = await api.put(`/api/bill/print/${parseInt(id)}`);
    if (res.status === 200) {
      history.replace(`/dashboard/bills/details/${id}/outstanding`);
    }
    return;
  };

  const dispense_meds = async () => {
    if (bill) {
      const res = await api.post(`/api/inventory/dispense`, [
        ...bill?.bill_items,
      ]);
      if (res.status === 200) {
        get_dispensed_items();
      }
    }
    return;
  };

  const is_dispensed = (row) => {
    const is_invItem = inventoryItems.find(function (invItem) {
      if (row.sales_service_item_id === invItem.sales_service_item_id) {
        return true;
      }
      return false;
    });
    const is_dispensedItem = dispensedItems.find(function (dt) {
      if (parseInt(dt.note.split(",")[1]) === row.id) {
        return true;
      }
      return false;
    });
    if (!is_invItem) return true;
    else return is_invItem && is_dispensedItem;
  };

  useEffect(() => {
    if (isPrintMode) {
      handlePrint();
    }
    // eslint-disable-next-line
  }, [isPrintMode]);

  useEffect(() => {
    if (bill?.bill_items) {
      get_inventory_items();
    }
    // eslint-disable-next-line
  }, [bill?.bill_items]);

  useEffect(() => {
    if (
      stage === "draft" ||
      stage === "outstanding" ||
      stage === "completed" ||
      stage === "cancelled"
    ) {
      getBill();
      get_dispensed_items();
    } else {
      history.goBack();
    }

    // eslint-disable-next-line
  }, [stage]);

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Toolbar>
          <BackButton
            backFunction={() => {
              if (location.state?.from === "bill_process") {
                history.replace(`/dashboard/bills/form`);
              } else {
                history.replace("/dashboard/bills");
              }
            }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              overflowX: "auto",
            }}
          >
            <Button
              variant="contained"
              size="small"
              sx={{ marginRight: "5px", display: showPay ? "block" : "none" }}
              onClick={make_payment}
            >
              Record Payment
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                marginRight: "5px",
                display: stage === "draft" ? "block" : "none",
              }}
              onClick={() => history.push(`/dashboard/bills/form/${id}`)}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ marginRight: "5px" }}
              onClick={() => setIsPrintMode(true)}
            >
              Print
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                minWidth: "80px",
                marginRight: "5px",
                display:
                  stage === "draft" &&
                  inventoryItems.length === dispensedItems.length
                    ? "block"
                    : "none",
              }}
              onClick={finalize}
            >
              Finalize
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                minWidth: "140px",
                marginRight: "5px",
                display: stage === "draft" ? "block" : "none",
              }}
              disabled={inventoryItems.length === dispensedItems.length}
              onClick={dispense_meds}
            >
              {inventoryItems.length === dispensedItems.length
                ? "Meds Dispensed"
                : "Dispense Meds"}
            </Button>
            <Button
              variant="contained"
              size="small"
              color="error"
              sx={{
                minWidth: "70px",
                marginRight: "5px",
                display:
                  stage === "draft" || stage === "outstanding"
                    ? "block"
                    : "none",
              }}
              onClick={() => setOpen(true)}
            >
              Cancel
            </Button>
          </Box>
        </Toolbar>
        <Container ref={receiptRef}>
          <BillsDetailInfo
            bill={bill}
            payment={payment}
            stage={stage}
            totalDeposit={totalDeposit}
          >
            <BillItemsTable
              bill_items={bill?.bill_items}
              isPrintMode={isPrintMode}
              is_dispensed={is_dispensed}
            />
          </BillsDetailInfo>
        </Container>
      </Box>
      <DeleteDialog
        isOpen={open}
        handleClose={() => {
          setOpen(false);
        }}
        callbackButtonName="OK"
        content="You are about to cancel the bill."
        callback={() => {
          cancelBill();
        }}
      />
    </>
  );
};

export default BillsDetail;
