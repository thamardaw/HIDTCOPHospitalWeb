import {
  Button,
  Checkbox,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";
import { alpha, Box } from "@mui/system";
import { styled, useTheme } from "@mui/material/styles";
import { Search } from "@mui/icons-material";
import { useHistory, useRouteMatch } from "react-router";
import { visuallyHidden } from "@mui/utils";
import { useState } from "react";

const SearchContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: alpha(theme.palette.primary.light, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.primary.light, 0.25),
  },
  borderRadius: theme.shape.borderRadius,
  width: "30%",
  [theme.breakpoints.down("sm")]: {
    display: (props) => (props.open ? "flex" : "none"),
    width: "40%",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "black",
  marginLeft: theme.spacing(1),
}));

// const ButtonContainer = styled(Box)(({ theme }) => ({
//   [theme.breakpoints.down("md")]: {
//     display: "none",
//   },
// }));

function createData(
  patient_id,
  name,
  calories,
  fat,
  carbs,
  protein,
  protein1,
  protein2
) {
  return {
    patient_id,
    name,
    calories,
    fat,
    carbs,
    protein,
    protein1,
    protein2,
  };
}

const rows = [
  createData(
    "DGL0000-2021",
    "Ye Yint Aung",
    "Male",
    "1997-03-02",
    24,
    "Yangon, Insein Township",
    "09798865233",
    "A"
  ),
  createData(
    "DGL0001-2021",
    "Zay Maw",
    "Male",
    "2003-03-02",
    18,
    "Yangon, Hlaing Township",
    "09798865233",
    "O"
  ),
  createData(
    "DGL0002-2021",
    "Aye Hla",
    "Female",
    "2005-03-02",
    16,
    "Yangon, Tharkayta Township",
    "09654865288",
    "AB"
  ),
  createData(
    "DGL0003-2021",
    "Kyaw Kyaw",
    "Male",
    "2000-03-02",
    21,
    "Yangon, Sanchaung Township",
    "09798005233",
    "A"
  ),
  createData(
    "DGL0004-2021",
    "Aye Aung",
    "Male",
    "2002-03-27",
    19,
    "Yangon, Hlaing Township",
    "09798865233",
    "O"
  ),
  createData(
    "DGL0005-2021",
    "Aye Hla",
    "Female",
    "2005-03-02",
    16,
    "Yangon, Tharkayta Township",
    "09654865288",
    "AB"
  ),
  createData(
    "DGL0006-2021",
    "Ye Yint Aung",
    "Male",
    "2021-03-02",
    24,
    "Yangon, Insein Township",
    "09798865233",
    "A"
  ),
  createData(
    "DGL0007-2021",
    "Zay Maw",
    "Male",
    "2005-03-02",
    16,
    "Yangon, Hlaing Township",
    "09798865233",
    "O"
  ),
  createData(
    "DGL0008-2021",
    "Aye Hla",
    "Female",
    "2005-03-02",
    16,
    "Yangon, Tharkayta Township",
    "09654865288",
    "AB"
  ),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "name2",
    numeric: false,
    disablePadding: true,
    label: "Patient ID",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "calories",
    numeric: false,
    disablePadding: false,
    label: "Gender",
  },
  {
    id: "fat",
    numeric: false,
    disablePadding: false,
    label: "Date Of Birth",
  },
  {
    id: "carbs",
    numeric: false,
    disablePadding: false,
    label: "Age",
  },
  {
    id: "protein",
    numeric: false,
    disablePadding: false,
    label: "Address",
  },
  {
    id: "protein2",
    numeric: false,
    disablePadding: false,
    label: "Contact Details",
  },
  {
    id: "protein3",
    numeric: false,
    disablePadding: false,
    label: "Blood Group",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;
  const history = useHistory();
  const { url } = useRouteMatch();

  return (
    <Toolbar
      sx={{
        display: "flex",
        justifyContent: "space-between",
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography variant="h6" id="tableTitle" component="div">
          Patient
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          {numSelected === 1 && (
            <>
              <Button
                variant="contained"
                size="small"
                sx={{ marginRight: "5px" }}
                onClick={() => history.push(`${url}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ marginRight: "5px" }}
                onClick={() => history.push(`${url}/detail`)}
              >
                Detail
              </Button>
            </>
          )}
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ marginRight: "5px" }}
          >
            Delete
          </Button>
        </>
      ) : (
        <>
          <SearchContainer>
            <Search />
            <StyledInputBase placeholder="Search..." />
          </SearchContainer>
          <Button
            variant="outlined"
            size="small"
            onClick={() => history.push(`${url}/create`)}
          >
            new
          </Button>
        </>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const PatientTable = () => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("name");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    defaultMatches: true,
  });
  // const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.patient_id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleChangeDense = (event) => {
  //   setDense(event.target.checked);
  // };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    // <Paper sx={{ flexGrow: 1, height: "87.5vh" }}>
    <Box sx={{ width: "100%" }}>
      {/* <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">Patient</Typography>
        <SearchContainer>
          <Search />
          <StyledInputBase placeholder="Search..." />
        </SearchContainer>
        <ButtonContainer>
          <Button
            variant="outlined"
            size="small"
            sx={{ marginRight: "5px" }}
            onClick={() => history.push(`${url}/create`)}
          >
            new
          </Button>
          <Button variant="outlined" size="small" sx={{ marginRight: "5px" }}>
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ marginRight: "5px" }}
          >
            Delete
          </Button>
          <Button variant="outlined" size="small" sx={{ marginRight: "5px" }}>
            Detail
          </Button>
        </ButtonContainer>
      </Toolbar> */}
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 100 }}
              aria-labelledby="tableTitle"
              size={isMobile ? "small" : "medium"}
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.patient_id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.patient_id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.patient_id}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {row.patient_id}
                        </TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.calories}</TableCell>
                        <TableCell>{row.fat}</TableCell>
                        <TableCell>{row.carbs}</TableCell>
                        <TableCell>{row.protein}</TableCell>
                        <TableCell>{row.protein1}</TableCell>
                        <TableCell>{row.protein2}</TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: (false ? 33 : 53) * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default PatientTable;
