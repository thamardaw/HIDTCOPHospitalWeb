import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { visuallyHidden } from "@mui/utils";
import { styled, useTheme } from "@mui/material/styles";
import { Button, InputBase, useMediaQuery } from "@mui/material";
import { useHistory, useRouteMatch } from "react-router";
import { Search } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

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

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
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
  headCells: PropTypes.array.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const {
    numSelected,
    selected,
    deleteDialog,
    onSelectAllClick,
    onChangeSearch,
    tableName,
    headCells,
  } = props;
  const history = useHistory();
  const { url } = useRouteMatch();
  const [CSV, setCSV] = useState({});
  const handleDelete = (event) => {
    onSelectAllClick(event);
    deleteDialog(selected[0].id);
  };
  useEffect(() => {
    const h = headCells.map((headCell) => {
      return { label: headCell.label, key: headCell.id };
    });
    setCSV({ data: selected, headers: h, filename: `${tableName}.csv` });
  }, [headCells, selected, tableName]);
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
          // sx={{ flex: "1 1 100%", display: { xs: "none" } }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          variant="h6"
          id="tableTitle"
          component="div"
          sx={{ fontSize: { xs: "14px", sm: "16px" } }}
        >
          {tableName}
        </Typography>
      )}

      {numSelected > 0 ? (
        <>
          {numSelected === 1 ? (
            <>
              <Button
                variant="contained"
                size="small"
                sx={{ marginRight: "5px" }}
                onClick={() => history.push(`${url}/form/${selected[0].id}`)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                size="small"
                sx={{ marginRight: "5px" }}
                onClick={() => history.push(`${url}/details/${selected[0].id}`)}
              >
                Details
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{ marginRight: "5px" }}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </>
          ) : (
            <CSVLink
              {...CSV}
              style={{ color: "inherit", textDecoration: "inherit" }}
            >
              <Button
                variant="contained"
                size="small"
                sx={{ marginRight: "5px" }}
              >
                CSV
              </Button>
            </CSVLink>
          )}
        </>
      ) : (
        <>
          <SearchContainer>
            <Search />
            <StyledInputBase
              placeholder="Search..."
              onChange={onChangeSearch}
            />
          </SearchContainer>
          <Button
            variant="outlined"
            size="small"
            onClick={() => history.push(`${url}/form`)}
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
  selected: PropTypes.array.isRequired,
  deleteDialog: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  onChangeSearch: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  headCells: PropTypes.array.isRequired,
};

// HeadCells ID have to be match with row's object key beause they two are dependent for sorting function
const CustomTable = ({ headCells, rows, deleteDialog, tableName }) => {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [page, setPage] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    defaultMatches: true,
  });
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const arraySearch = (array, keyword, objKeys) => {
    const searchItem = keyword.toLowerCase();
    return array.filter((value) => {
      let t = objKeys.map((key) => {
        return value[key.id].toLowerCase().includes(searchItem);
      });
      return t.includes(true);
    });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearch = (event) => {
    if (event.target.value.length === 0) {
      setDataRows(rows);
    } else {
      setDataRows(arraySearch(rows, event.target.value, headCells));
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(dataRows);
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

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  useEffect(() => {
    setDataRows(rows);
  }, [rows]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar
          tableName={tableName}
          numSelected={selected.length}
          selected={selected}
          deleteDialog={deleteDialog}
          onSelectAllClick={handleSelectAllClick}
          onChangeSearch={handleSearch}
          headCells={headCells}
        />
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
              rowCount={dataRows.length}
              headCells={headCells}
            />
            <TableBody>
              {stableSort(dataRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
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
                      {headCells.map((headCell, index) => (
                        <TableCell
                          padding={index === 0 ? "none" : "normal"}
                          key={headCell.id}
                        >
                          {row[headCell.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (false ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={headCells.length + 1} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};

export default CustomTable;
