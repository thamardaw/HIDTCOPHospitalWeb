import React from "react";
import { styled } from "@mui/material/styles";
import {
  TableCell,
  Table,
  TableHead,
  TableBody,
  TableRow,
  tableCellClasses,
  TableContainer,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const DailyClosingBillTable = ({ data, maxHeight, marginTop }) => {
  return (
    <TableContainer sx={{ maxHeight: maxHeight, marginTop: marginTop }}>
      <Table sx={{ minWidth: 380 }} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Bill ID</StyledTableCell>
            <StyledTableCell>Patient ID</StyledTableCell>
            <StyledTableCell>Patient Name</StyledTableCell>
            <StyledTableCell>Total Amount</StyledTableCell>
            <StyledTableCell>Deposit Amount</StyledTableCell>
            <StyledTableCell>Collected Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
              }}
            >
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell component="th" scope="row">
                {row.bill_id}
              </TableCell>
              <TableCell>{row.patient_id}</TableCell>
              <TableCell>{row.patient_name}</TableCell>
              <TableCell>{row.amount}</TableCell>
              <TableCell>{row.deposit_amount}</TableCell>
              <TableCell>{row.collected_amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DailyClosingBillTable;
