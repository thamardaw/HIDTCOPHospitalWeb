import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { Button, InputBase } from "@mui/material";
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

const CustomTableToolbar = (props) => {
  const {
    numSelected,
    selected,
    onSelectAllClick,
    onChangeSearch,
    tableName,
    headCells,
    onCreate,
    onEdit,
    onDetail,
    onDelete,
    addCreate,
    addDelete,
    addDetail,
    addEdit,
    addcsv,
    createBtnName,
    editBtnName,
    deleteBtnName,
    detailBtnName,
    enableMultipleDelete,
  } = props;
  const history = useHistory();
  const { url } = useRouteMatch();
  const [CSV, setCSV] = useState({});

  const deleteItem = (event) => {
    onSelectAllClick(event);
    onDelete(selected);
  };

  const createItem = () => {
    if (onCreate) {
      onCreate();
    } else {
      history.push(`${url}/form`);
    }
  };

  const updateItem = () => {
    if (onEdit) {
      onEdit(selected[0].id);
    } else {
      history.push(`${url}/form/${selected[0].id}`);
    }
  };

  const readItem = () => {
    if (onDetail) {
      onDetail(selected[0].id);
    } else {
      history.push(`${url}/details/${selected[0].id}`);
    }
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
              {addEdit && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ marginRight: "5px" }}
                  onClick={updateItem}
                >
                  {editBtnName}
                </Button>
              )}
              {addDetail && (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ marginRight: "5px" }}
                  onClick={readItem}
                >
                  {detailBtnName}
                </Button>
              )}
              {addDelete && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ marginRight: "5px" }}
                  onClick={deleteItem}
                >
                  {deleteBtnName}
                </Button>
              )}
            </>
          ) : (
            <>
              {addcsv && (
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
              {addDelete && enableMultipleDelete && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ marginRight: "5px" }}
                  onClick={deleteItem}
                >
                  {deleteBtnName}
                </Button>
              )}
            </>
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
          {addCreate ? (
            <Button variant="outlined" size="small" onClick={createItem}>
              {createBtnName}
            </Button>
          ) : (
            <Box></Box>
          )}
        </>
      )}
    </Toolbar>
  );
};

CustomTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  onChangeSearch: PropTypes.func.isRequired,
  tableName: PropTypes.string.isRequired,
  headCells: PropTypes.array.isRequired,
  onCreate: PropTypes.func,
  onEdit: PropTypes.func,
  onDetail: PropTypes.func,
  onDelete: PropTypes.func,
  addCreate: PropTypes.bool,
  addDelete: PropTypes.bool,
  addDetail: PropTypes.bool,
  addEdit: PropTypes.bool,
  addcsv: PropTypes.bool,
  createBtnName: PropTypes.string,
  editBtnName: PropTypes.string,
  deleteBtnName: PropTypes.string,
  detailBtnName: PropTypes.string,
  enableMultipleDelete: PropTypes.bool,
};

export default CustomTableToolbar;
