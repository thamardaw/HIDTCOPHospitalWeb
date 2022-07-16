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
  IconButton,
  Divider,
  Menu,
  MenuItem,
  TextField,
  Button,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  withBillItems,
  withCurrentPatient,
  withTotalDeposit,
} from "../recoil/billForm";
import { useEffect, useState } from "react";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const BillFormPreview = () => {
  const currentPatient = useRecoilValue(withCurrentPatient);
  const totalDeposit = useRecoilValue(withTotalDeposit);
  const [billItems, setBillItems] = useRecoilState(withBillItems);
  const [editingItem, setEditingItem] = useState({
    index: 0,
    quantity: 0,
    price: 0,
  });
  const [totalAmount, setTotalAmount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (event, index) => {
    setEditingItem({
      ...editingItem,
      index: index,
      quantity: billItems[index].quantity,
    });
    setAnchorEl(event.currentTarget);
  };

  const removeItem = (i) => {
    const copy_billItems = [...billItems];
    copy_billItems.splice(i, 1);
    setBillItems(copy_billItems);
  };

  const updateItem = () => {
    let copy_billItems = JSON.parse(JSON.stringify(billItems));
    copy_billItems[editingItem.index].quantity = editingItem.quantity;
    setBillItems(copy_billItems);
    handleClose();
    setEditingItem({
      index: 0,
      quantity: 0,
      price: 0,
    });
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
            <Typography variant="body">Patient ID</Typography>
          </Box>
          <Typography variant="body">: {currentPatient?.id}</Typography>
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
            <Typography variant="body">Patient Name</Typography>
          </Box>
          <Typography variant="body">: {currentPatient?.name}</Typography>
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
            <Typography variant="body">Patient Phone</Typography>
          </Box>
          <Typography variant="body">
            : {currentPatient?.contactDetails}
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
            <Typography variant="body">Patient Address</Typography>
          </Box>
          <Typography variant="body">: {currentPatient?.address}</Typography>
        </Box>
      </Container>
      <Container sx={{ paddingTop: "10px" }}>
        <TableContainer sx={{ maxHeight: 260 }}>
          <Table
            sx={{ minWidth: 380 }}
            aria-label="simple table"
            size="small"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <StyledTableCell>No</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell align="right">Price</StyledTableCell>
                <StyledTableCell align="right">Quantity</StyledTableCell>
                <StyledTableCell align="right">UOM</StyledTableCell>
                <StyledTableCell align="right">SubTotal</StyledTableCell>
                <StyledTableCell align="center">Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billItems.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">{row.uom}</TableCell>
                  <TableCell align="right">
                    {row.price * row.quantity}
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        onClick={(e) => handleEdit(e, index)}
                        sx={{
                          padding: "0px",
                          margin: "0px",
                          marginRight: "5px",
                        }}
                      >
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => removeItem(index)}
                        sx={{ padding: "0px", margin: "0px" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
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
            Deposit :
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {totalDeposit}MMK
          </Typography>
        </Box>
        <Divider />
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
            Total :
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {totalAmount}MMK
          </Typography>
        </Box>
        <Divider />
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
            Unpaid :
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ fontSize: { xs: "14px", sm: "16px" } }}
          >
            {totalAmount - totalDeposit}MMK
          </Typography>
        </Box>
      </Container>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <TextField
            label="Quantity"
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            size="small"
            sx={{ width: "120px" }}
            value={editingItem.quantity}
            onChange={(e) =>
              setEditingItem({ ...editingItem, quantity: e.target.value })
            }
          />
        </MenuItem>
        <MenuItem>
          <Button
            variant="contained"
            size="small"
            onClick={updateItem}
            fullWidth
          >
            Save
          </Button>
        </MenuItem>
      </Menu>
    </>
  );
};

export default BillFormPreview;
