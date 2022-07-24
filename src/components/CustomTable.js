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
import { useEffect, useState } from "react";
import { Button, InputBase, LinearProgress } from "@mui/material";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { CSVLink } from "react-csv";
import { styled } from "@mui/material/styles";
import { Search } from "@mui/icons-material";
import {
  withOrder,
  withOrderBy,
  withPage,
  withRowsPerPage,
} from "../recoil/customTable";
import { useRecoilState } from "recoil";

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
    width: "60%",
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

function CustomTableHead(props) {
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
              "aria-label": "select all",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              minWidth: `${headCell.minWidth}px`,
              maxWidth: `${
                headCell.maxWidth || headCell.minWidth + 100 || 200
              }px`,
              display: headCell?.disable && "none",
            }}
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

CustomTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
};

const CustomTableToolbar = (props) => {
  const { selected, numSelected, tableName, toolbarButtons, onSearch } = props;

  return (
    <Toolbar
      sx={{
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
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          {numSelected === 1 ? (
            <>
              {toolbarButtons.whenOneSelected.map(
                ({ id, component: Component, callback }) => {
                  return (
                    <Component key={id} onClick={() => callback(selected)} />
                  );
                }
              )}
            </>
          ) : (
            <>
              {toolbarButtons.whenMoreThanOneSelected.map(
                ({ id, component: Component, callback }) => {
                  return (
                    <Component key={id} onClick={() => callback(selected)} />
                  );
                }
              )}
            </>
          )}
        </>
      ) : (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "start",
              width: "100%",
            }}
          >
            <Typography
              variant="h6"
              id="tableTitle"
              component="div"
              sx={{
                fontSize: "16px",
                display: { xs: "block", sm: "none" },
                padding: "10px 0px",
              }}
            >
              {tableName}
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                id="tableTitle"
                component="div"
                sx={{ fontSize: "16px", display: { xs: "none", sm: "block" } }}
              >
                {tableName}
              </Typography>
              <SearchContainer>
                <Search />
                <StyledInputBase placeholder="Search..." onChange={onSearch} />
              </SearchContainer>
              {toolbarButtons.whenNoneSelected.map(
                ({ id, component: Component, callback }) => {
                  return (
                    <Component key={id} onClick={() => callback(selected)} />
                  );
                }
              )}
            </Box>
          </Box>
        </>
      )}
    </Toolbar>
  );
};

CustomTableToolbar.propTypes = {
  selected: PropTypes.array.isRequired,
  numSelected: PropTypes.number.isRequired,
  tableName: PropTypes.string.isRequired,
  toolbarButtons: PropTypes.object.isRequired,
  onSearch: PropTypes.func.isRequired,
};

export default function CustomTable({
  tableConfig,
  data,
  toolbarButtons,
  isLoading,
}) {
  const [order, setOrder] = useRecoilState(withOrder(tableConfig.atom));
  const [orderBy, setOrderBy] = useRecoilState(withOrderBy(tableConfig.atom));
  const [dataRows, setDataRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useRecoilState(withPage(tableConfig.atom));
  const [rowsPerPage, setRowsPerPage] = useRecoilState(
    withRowsPerPage(tableConfig.atom)
  );
  const [CSV, setCSV] = useState({
    data: [],
  });

  const arraySearch = (array, keyword, objKeys) => {
    const searchItem = keyword.toLowerCase();
    return array.filter((value) => {
      let t = objKeys.map((key) => {
        if (key?.disable) return false;
        if (!value[key.id]) return false;
        return value[key.id].toString().toLowerCase().includes(searchItem);
      });
      return t.includes(true);
    });
  };

  const handleSearch = (event) => {
    if (event.target.value.length === 0) {
      setDataRows(data);
    } else {
      setPage(0);
      setDataRows(arraySearch(data, event.target.value, tableConfig.headCells));
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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
    if (newSelected.length === 0) {
      setDataRows(data);
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

  // Avoid a layout jump when reaching the last page with empty data.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  useEffect(() => {
    setDataRows(data);
    const h = tableConfig.headCells.map((headCell) => {
      return { label: headCell.label, key: headCell.id };
    });
    setCSV({
      data: [...data],
      headers: h,
      filename: `${tableConfig.tableName}.csv`,
    });
    setSelected([]);
  }, [data, tableConfig]);

  useEffect(() => {
    if (selected.length !== 0) {
      setCSV((prev) => {
        return { ...prev, data: [...selected] };
      });
    } else {
      setCSV((prev) => {
        return { ...prev, data: [...data] };
      });
    }
  }, [selected, data]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 1 }}>
        <CustomTableToolbar
          selected={selected}
          numSelected={selected.length}
          tableName={tableConfig.tableName}
          toolbarButtons={toolbarButtons}
          onSearch={handleSearch}
        />
        {isLoading && <LinearProgress />}
        <TableContainer sx={{ maxHeight: tableConfig.maxHeight }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={false ? "small" : "medium"}
          >
            <CustomTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={dataRows.length}
              headCells={tableConfig.headCells}
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
                      {tableConfig.headCells.map((headCell) => (
                        <TableCell
                          padding={headCell.disablePadding ? "none" : "normal"}
                          key={headCell.id}
                          sx={{
                            maxWidth: `${
                              headCell.maxWidth ||
                              headCell.minWidth + 100 ||
                              200
                            }px`,
                            // wordWrap: "break-word",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: headCell?.disable && "none",
                          }}
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
                  <TableCell colSpan={`${tableConfig.headCells.leng + 1}`} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          display="flex"
          alignItems="center"
          pl={1}
          justifyContent="space-between"
        >
          <CSVLink
            {...CSV}
            style={{ color: "inherit", textDecoration: "inherit" }}
          >
            <Button
              variant="text"
              size="small"
              startIcon={<FileDownloadOutlinedIcon />}
            >
              Export
            </Button>
          </CSVLink>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
            component="div"
            count={dataRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Paper>
    </Box>
  );
}
