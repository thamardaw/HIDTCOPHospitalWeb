import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Box, IconButton, TableCell, TableRow, TextField } from "@mui/material";
import { useState } from "react";

const BillItemsTableRow = ({
  isEditable = true,
  index,
  row,
  onEdit,
  onDelete,
}) => {
  const [editMode, setEditMode] = useState(true);
  const [detail, setDetail] = useState({ quantity: 0 });

  const onEditButtonClick = () => {
    if (editMode) {
      setDetail({ ...detail, quantity: row.quantity });
      setEditMode(false);
      return;
    }
    onEdit(index, row, detail);
    setEditMode(true);
  };

  return (
    <TableRow
      selected={!editMode}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
    >
      <TableCell component="th" scope="row" sx={{ minWidth: "16px" }}>
        {index + 1}
      </TableCell>
      {row?.created_time && (
        <TableCell sx={{ minWidth: "80px" }}>
          {row?.created_time.split("T")[0]}
        </TableCell>
      )}
      <TableCell sx={{ minWidth: "120px" }}>{row.name}</TableCell>
      <TableCell sx={{ minWidth: "24px" }}>{row.price}</TableCell>
      <TableCell sx={{ minWidth: "80px", padding: "2px 0px" }}>
        {editMode ? (
          row.quantity
        ) : (
          <TextField
            fullWidth
            autoFocus
            size="small"
            type="number"
            InputProps={{
              inputProps: { min: "0", step: "1" },
            }}
            value={detail.quantity}
            onChange={(e) => setDetail({ ...detail, quantity: e.target.value })}
          />
        )}
      </TableCell>
      <TableCell sx={{ minWidth: "24px" }}>{row.uom}</TableCell>
      <TableCell sx={{ minWidth: "32px" }}>
        {row.price * row.quantity}
      </TableCell>
      <TableCell align="center" sx={{ minWidth: "32px" }}>
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
            onClick={onEditButtonClick}
            sx={{
              padding: "0px",
              margin: "0px",
              marginRight: "5px",
              display: isEditable ? "span" : "none",
            }}
          >
            {editMode ? <ModeEditIcon /> : <SaveIcon />}
          </IconButton>
          <IconButton
            aria-label="delete"
            color="error"
            onClick={() => onDelete(index, row)}
            sx={{ padding: "0px", margin: "0px" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default BillItemsTableRow;
