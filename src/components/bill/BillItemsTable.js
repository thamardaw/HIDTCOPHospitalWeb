import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMemo } from "react";
import { getComparator, stableSort } from "../../utils/sorting";

const StyledTableCell = styled(TableCell)(
  ({ theme, backgroundColor, maxWidth, show }) => ({
    backgroundColor: backgroundColor,
    fontSize: "1.2rem",
    fontWeight: 650,
    wordWrap: "break-word",
    maxWidth: maxWidth,
    display: show && "none",
  })
);

const BillItemsTable = ({ bill_items, isPrintMode, is_dispensed }) => {
  const removeDuplicateObjectFromArray = (array, key) => {
    let check = new Set();
    return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
  };

  const group_bill_items = useMemo(() => {
    if (!bill_items) return;
    const grouped_list = [];
    bill_items.forEach((billItem) => {
      const same = bill_items.filter((bi) => {
        return bi.name === billItem.name && bi.price === billItem.price;
      });
      let quantity = 0;
      let subtotal = 0;
      same.forEach((s) => {
        subtotal += s.subtotal;
        quantity += s.quantity;
      });
      grouped_list.push({
        ...same[0],
        subtotal: subtotal,
        quantity: quantity,
      });
    });
    const result = removeDuplicateObjectFromArray(grouped_list, "id");
    return result;
  }, [bill_items]);

  return (
    <TableContainer>
      <Table
        sx={{
          minWidth: 380,
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
        }}
      >
        <TableHead
          sx={{
            display: "table-row-group",
          }}
        >
          <TableRow
            sx={{
              borderTop: "4px solid black",
              borderBottom: "4px solid black",
            }}
          >
            <StyledTableCell maxWidth="75px" show={isPrintMode} padding="none">
              Date
            </StyledTableCell>
            <StyledTableCell maxWidth="130px" padding={isPrintMode && "none"}>
              Name
            </StyledTableCell>
            <StyledTableCell maxWidth="75px" align="right">
              Price
            </StyledTableCell>
            <StyledTableCell maxWidth="55px" align="right">
              Qty
            </StyledTableCell>
            <StyledTableCell maxWidth="120px" align="right">
              Subtotal
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bill_items &&
            group_bill_items &&
            stableSort(
              isPrintMode ? group_bill_items : bill_items,
              getComparator("asc", "id")
            ).map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  "&:last-child td, &:last-child th": {
                    borderBottom: "4px solid black",
                  },
                }}
              >
                <StyledTableCell
                  maxWidth="75px"
                  show={isPrintMode}
                  padding="none"
                >
                  {row?.created_time?.split("T")[0]}
                </StyledTableCell>
                <StyledTableCell
                  maxWidth="130px"
                  sx={{
                    color: is_dispensed(row) ? "black" : "gray",
                  }}
                  padding={isPrintMode && "none"}
                >
                  {row?.name}
                </StyledTableCell>
                <StyledTableCell maxWidth="75px" align="right">
                  {row?.price}
                </StyledTableCell>
                <StyledTableCell maxWidth="55px" align="right">
                  {row?.quantity}
                </StyledTableCell>
                <StyledTableCell maxWidth="120px" align="right">
                  {row?.subtotal}
                </StyledTableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BillItemsTable;
