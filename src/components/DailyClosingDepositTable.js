import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  tableCellClasses,
  TableCell,
  TableContainer,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const DailyClosingDepositTable = ({ data, maxHeight, marginTop }) => {
  return (
    <TableContainer sx={{ maxHeight: maxHeight, marginTop: marginTop }}>
      <Table sx={{ minWidth: 380 }} size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell>Deposit ID</StyledTableCell>
            <StyledTableCell>Patient ID</StyledTableCell>
            <StyledTableCell>Patient Name</StyledTableCell>
            <StyledTableCell>Deposit Amount</StyledTableCell>
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
                {row.deposit_id}
              </TableCell>
              <TableCell>{row.patient_id}</TableCell>
              <TableCell>{row.patient_name}</TableCell>
              <TableCell>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DailyClosingDepositTable;
