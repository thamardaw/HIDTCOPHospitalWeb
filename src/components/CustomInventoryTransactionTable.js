import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { getComparator, stableSort } from "../utils/sorting";
import { CacheContext } from "../contexts";
import CustomTableHead from "./CustomTableHead";
import CustomInventoryTransactionToolbar from "./CustomInventoryTransactionToolbar";

// HeadCells ID have to be match with row's object key beause they two are dependent for sorting function
const CustomInventoryTransactionTable = ({
  headCells,
  rows,
  tableName,
  onCreate,
  onDetail,
  onEdit,
  onDelete,
  addCreate = true,
  addEdit = true,
  addDelete = true,
  addDetail = true,
  addcsv = true,
  createBtnName = "New",
  editBtnName = "Edit",
  detailBtnName = "Details",
  deleteBtnName = "Delete",
  enableMultipleDelete = false,
}) => {
  const [selected, setSelected] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"), {
    defaultMatches: true,
  });
  // const [order, setOrder] = useState("desc");
  // const [orderBy, setOrderBy] = useState("id");
  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(25);
  const { table } = useContext(CacheContext);

  const {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
    order,
    setOrder,
    orderBy,
    setOrderBy,
  } = table;

  const arraySearch = (array, keyword, objKeys) => {
    const searchItem = keyword.toLowerCase();
    return array.filter((value) => {
      let t = objKeys.map((key) => {
        return value[key.id].toString().toLowerCase().includes(searchItem);
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
      setPage(0);
      setDataRows(arraySearch(rows, event.target.value, headCells));
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      setSelected(dataRows);
      return;
    }
    setDataRows(rows);
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
      setDataRows(rows);
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
        <CustomInventoryTransactionToolbar
          tableName={tableName}
          numSelected={selected.length}
          selected={selected}
          onSelectAllClick={handleSelectAllClick}
          onChangeSearch={handleSearch}
          headCells={headCells}
          onCreate={onCreate}
          onEdit={onEdit}
          onDetail={onDetail}
          onDelete={onDelete}
          addCreate={addCreate}
          addDelete={addDelete}
          addDetail={addDetail}
          addEdit={addEdit}
          addcsv={addcsv}
          createBtnName={createBtnName}
          editBtnName={editBtnName}
          deleteBtnName={deleteBtnName}
          detailBtnName={detailBtnName}
          enableMultipleDelete={enableMultipleDelete}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 100 }}
            aria-labelledby="tableTitle"
            size={isMobile ? "small" : "medium"}
          >
            <CustomTableHead
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
          rowsPerPageOptions={[5, 10, 25, 50, 75, 100]}
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

export default CustomInventoryTransactionTable;
