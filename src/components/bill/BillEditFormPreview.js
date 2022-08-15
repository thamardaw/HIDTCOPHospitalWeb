import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Container,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useAxios } from "../../hooks";
import { useState, useEffect } from "react";
import { generateID } from "../../utils/generateID";
import { styled } from "@mui/material/styles";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import BillItemsTableRow from "./BillItemsTableRow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DetailsRow } from "../common";

// stableSort(bill.data.bill_items, getComparator("desc", "id"));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#EBEBEB",
  },
}));

const BillEditFormPreview = ({
  id,
  data,
  getData,
  isLoading,
  isDispensed,
  totalDeposit,
}) => {
  const api = useAxios({ autoSnackbar: true });
  const [details, setDetails] = useState({});
  const [filter, setFilter] = useState({
    date: "",
    name: "",
  });
  const [dateFilterAnchorEl, setDateFilterAnchorEl] = useState(null);
  const [nameFilterAnchorEl, setNameFilterAnchorEl] = useState(null);
  const dateFilterOpen = Boolean(dateFilterAnchorEl);
  const nameFilterOpen = Boolean(nameFilterAnchorEl);

  const resetFilter = () => {
    setFilter({ date: "", name: "" });
  };

  const updateItem = async (index, row, data) => {
    const res = await api.put(
      `/api/bill/billItem/${row.id}/?quantity=${data.quantity}`
    );
    if (res.status === 200) {
      getData();
    }
  };

  const removeItem = async (index, row) => {
    const [item, invtx] = await Promise.all([
      api.delete(`/api/bill/${id}/billItem/${row.id}`),
      api.post(`/api/inventory/return`, { ...row }),
    ]);
    if (item.status === 200 && invtx.status === 200) {
      getData();
    }
  };

  useEffect(() => {
    resetFilter();
    setDetails(data);
  }, [data]);

  useEffect(() => {
    const date = filter.date.toLowerCase();
    const name = filter.name.toLowerCase();
    if (date === "" && name === "") {
      setDetails({
        ...details,
        bill_items: data?.bill_items,
      });
      return;
    }
    const v = data?.bill_items.filter((value) => {
      return (
        (date === "" ||
          value["created_time"].toString().toLowerCase().includes(date)) &&
        (name === "" || value["name"].toString().toLowerCase().includes(name))
      );
    });
    setDetails({
      ...details,
      bill_items: v,
    });
    // eslint-disable-next-line
  }, [filter]);

  return (
    <>
      <Container sx={{ paddingTop: { xs: "20px", sm: "20px", md: "0px" } }}>
        <Accordion disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography fontWeight="bold" sx={{ width: "20%", flexShrink: 0 }}>
              Bill Info
            </Typography>
            {/* <Typography sx={{ color: "text.secondary" }}>
              I am an accordion
            </Typography> */}
          </AccordionSummary>
          <AccordionDetails>
            <DetailsRow
              name="Bill ID"
              value={generateID(parseInt(id))}
              padding="5px 0px"
              marginV={0}
              textVariant="body"
            />
            <DetailsRow
              name="Patient ID"
              value={
                details?.patient_id &&
                generateID(details?.patient_id, details?.patient.created_time)
              }
              padding="5px 0px"
              marginV={0}
              textVariant="body"
            />
            <DetailsRow
              name="Name"
              value={details?.patient_name}
              padding="5px 0px"
              marginV={0}
              textVariant="body"
            />
            <DetailsRow
              name="Age"
              value={details?.patient?.age}
              padding="5px 0px"
              marginV={0}
              textVariant="body"
            />
            <DetailsRow
              name="Phone"
              value={details?.patient_phone}
              padding="5px 0px"
              marginV={0}
              textVariant="body"
            />
            <DetailsRow
              name="Address"
              value={details?.patient_address}
              padding="5px 0px"
              marginV={0}
              textVariant="body"
            />
          </AccordionDetails>
        </Accordion>
        <Accordion defaultExpanded disableGutters>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="bill-items"
            id="bill-items"
          >
            <Typography fontWeight="bold">Bill Items</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {isLoading && <LinearProgress />}
            <TableContainer sx={{ maxHeight: 300 }}>
              <Table
                sx={{ minWidth: 400 }}
                aria-label="simple table"
                size="small"
                stickyHeader
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell sx={{ minWidth: "16px" }}>
                      No
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: "80px",
                        }}
                      >
                        Date
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            setDateFilterAnchorEl(event.currentTarget);
                          }}
                        >
                          <Badge
                            variant="dot"
                            invisible={filter.date === ""}
                            color="primary"
                          >
                            <FilterAltIcon fontSize="small" />
                          </Badge>
                        </IconButton>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: "120px",
                        }}
                      >
                        Name
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            setNameFilterAnchorEl(event.currentTarget);
                          }}
                        >
                          <Badge
                            variant="dot"
                            invisible={filter.name === ""}
                            color="primary"
                          >
                            <FilterAltIcon fontSize="small" />
                          </Badge>
                        </IconButton>
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: "24px" }}>
                      Price
                    </StyledTableCell>
                    <StyledTableCell padding="none" sx={{ minWidth: "80px" }}>
                      Qty
                    </StyledTableCell>
                    <StyledTableCell sx={{ minWidth: "24px" }}>
                      UOM
                    </StyledTableCell>
                    <Tooltip
                      title={
                        details?.bill_items &&
                        details.bill_items.reduce(
                          (total, num) => total + num.subtotal,
                          0
                        )
                      }
                      arrow
                      placement="top"
                    >
                      <StyledTableCell sx={{ minWidth: "32px" }}>
                        SubTotal
                      </StyledTableCell>
                    </Tooltip>
                    <StyledTableCell align="center" sx={{ minWidth: "32px" }}>
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details?.bill_items &&
                    details.bill_items.map((row, index) => (
                      <BillItemsTableRow
                        key={index}
                        isEditable={!isDispensed(row)}
                        index={index}
                        row={row}
                        onEdit={updateItem}
                        onDelete={removeItem}
                      />
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      </Container>
      <Container sx={{ paddingTop: { xs: "20px", sm: "5px" } }}>
        <DetailsRow
          name="Total"
          value={details?.total_amount}
          padding="5px 14px"
          marginV={0}
          textVariant="body"
        />
        <DetailsRow
          name="Deposit"
          value={totalDeposit}
          padding="5px 14px"
          marginV={0}
          textVariant="body"
        />
        <DetailsRow
          name="Unpaid"
          value={details?.total_amount && details?.total_amount - totalDeposit}
          padding="5px 14px"
          marginV={0}
          textVariant="body"
        />
      </Container>
      <Menu
        anchorEl={dateFilterAnchorEl}
        open={dateFilterOpen}
        onClose={() => setDateFilterAnchorEl(null)}
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
            label="Date"
            placeholder="YYYY-MM-DD"
            size="small"
            sx={{ width: "120px" }}
            value={filter.date}
            onChange={(e) => setFilter({ ...filter, date: e.target.value })}
          />
        </MenuItem>
      </Menu>
      <Menu
        anchorEl={nameFilterAnchorEl}
        open={nameFilterOpen}
        onClose={() => setNameFilterAnchorEl(null)}
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
            label="Name"
            size="small"
            sx={{ width: "120px" }}
            value={filter.name}
            onChange={(e) => setFilter({ ...filter, name: e.target.value })}
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default BillEditFormPreview;
