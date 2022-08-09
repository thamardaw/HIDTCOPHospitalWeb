import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Typography,
  tableCellClasses,
  TableBody,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  withBillItems,
  withCurrentPatient,
  withTotalDeposit,
} from "../recoil/billForm";
import { useEffect, useState } from "react";
import BillItemsTableRow from "./BillItemsTableRow";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const BillFormPreview = () => {
  const currentPatient = useRecoilValue(withCurrentPatient);
  const totalDeposit = useRecoilValue(withTotalDeposit);
  const [billItems, setBillItems] = useRecoilState(withBillItems);
  const [totalAmount, setTotalAmount] = useState(0);

  const updateItem = (index, row, data) => {
    let copy_billItems = JSON.parse(JSON.stringify(billItems));
    copy_billItems[index].quantity = data.quantity;
    setBillItems(copy_billItems);
  };

  const removeItem = (index, row) => {
    const copy_billItems = [...billItems];
    copy_billItems.splice(index, 1);
    setBillItems(copy_billItems);
  };

  useEffect(() => {
    let total = 0;
    billItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    setTotalAmount(total);
  }, [billItems]);

  return (
    <>
      <Container sx={{ paddingTop: { xs: "20px", sm: "0px" } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
            >
              Patient ID
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {currentPatient?.id}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
            >
              Name
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {currentPatient?.name}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
            >
              Phone
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {currentPatient?.contactDetails}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "5px 0px",
          }}
        >
          <Box sx={{ width: "30%" }}>
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "14px", sm: "16px" } }}
            >
              Address
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {currentPatient?.address}
          </Typography>
        </Box>
      </Container>
      <Container sx={{ paddingTop: "10px" }}>
        <TableContainer sx={{ maxHeight: 260 }}>
          <Table
            sx={{ minWidth: 500 }}
            aria-label="simple table"
            size="small"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ minWidth: "16px" }}>No</StyledTableCell>
                <StyledTableCell sx={{ minWidth: "120px" }}>
                  Name
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: "24px" }}>
                  Price
                </StyledTableCell>
                <StyledTableCell padding="none" sx={{ minWidth: "80px" }}>
                  Qty
                </StyledTableCell>
                <StyledTableCell sx={{ minWidth: "24px" }}>UOM</StyledTableCell>
                <StyledTableCell sx={{ minWidth: "32px" }}>
                  SubTotal
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ minWidth: "32px" }}>
                  Actions
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billItems.map((row, index) => (
                // <TableRow
                //   key={index}
                //   sx={{
                //     "&:last-child td, &:last-child th": { border: 0 },
                //   }}
                // >
                //   <TableCell component="th" scope="row">
                //     {index + 1}
                //   </TableCell>
                //   <TableCell>{row.name}</TableCell>
                //   <TableCell align="right">{row.price}</TableCell>
                //   <TableCell align="right">{row.quantity}</TableCell>
                //   <TableCell align="right">{row.uom}</TableCell>
                //   <TableCell align="right">
                //     {row.price * row.quantity}
                //   </TableCell>
                //   <TableCell align="center">
                //     <Box
                //       sx={{
                //         display: "flex",
                //         alignItems: "center",
                //         justifyContent: "center",
                //       }}
                //     >
                //       <IconButton
                //         aria-label="edit"
                //         color="primary"
                //         onClick={(e) => handleEdit(e, index)}
                //         sx={{
                //           padding: "0px",
                //           margin: "0px",
                //           marginRight: "5px",
                //         }}
                //       >
                //         <ModeEditIcon />
                //       </IconButton>
                //       <IconButton
                //         aria-label="delete"
                //         color="error"
                //         onClick={() => removeItem(index)}
                //         sx={{ padding: "0px", margin: "0px" }}
                //       >
                //         <DeleteIcon />
                //       </IconButton>
                //     </Box>
                //   </TableCell>
                // </TableRow>
                <BillItemsTableRow
                  key={index}
                  index={index}
                  row={row}
                  onEdit={updateItem}
                  onDelete={removeItem}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Container sx={{ paddingTop: { xs: "20px", sm: "5px" } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            Total
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {totalAmount}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            Deposit
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {totalDeposit}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            Unpaid
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {totalAmount - totalDeposit}
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default BillFormPreview;
