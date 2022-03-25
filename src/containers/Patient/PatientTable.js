import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useContext, useEffect, useState } from "react";
import { CustomTable } from "../../components";
import LoadingContext from "../../contexts/LoadingContext";
import { useAxios } from "../../hooks";
import { extractID } from "../../utils/extractID";
import { generateID } from "../../utils/generateID";

const headCells = [
  {
    id: "id",
    numeric: false,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Name",
  },
  {
    id: "age",
    numeric: false,
    disablePadding: false,
    label: "Age",
  },
  {
    id: "contactDetails",
    numeric: false,
    disablePadding: false,
    label: "Contact Details",
  },
  {
    id: "gender",
    numeric: false,
    disablePadding: false,
    label: "Gender",
  },
  {
    id: "dataOfBirth",
    numeric: false,
    disablePadding: false,
    label: "Date Of Birth",
  },
  {
    id: "address",
    numeric: false,
    disablePadding: false,
    label: "Address",
  },
  {
    id: "dateAndTime",
    numeric: false,
    disablePadding: false,
    label: "Date And Time",
  },
];
const PatientTable = () => {
  const api = useAxios({ autoSnackbar: true });
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const { setScreenLoading } = useContext(LoadingContext);

  const handleClickOpen = (arr) => {
    setSelected(arr);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getData = useCallback(async () => {
    setScreenLoading(true);
    const res = await api.get("/api/patients/");
    if (res.status === 200) {
      const data = res.data.map((row) => {
        const ID = generateID(row.id, row.created_time);
        const dateAndTime = `${row.created_time.split("T")[0]} ${new Date(
          row.created_time
        ).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}`;
        return {
          id: ID,
          name: row.name,
          age: row.age,
          contactDetails: row.contact_details,
          gender: row.gender,
          dataOfBirth: row.date_of_birth,
          address: row.address,
          dateAndTime: dateAndTime,
        };
      });
      setRows(data);
      setScreenLoading(false);
    }
    return;
    // eslint-disable-next-line
  }, []);

  const deleteItem = async () => {
    if (selected.length === 0) {
      return;
    } else if (selected.length === 1) {
      await api.delete(
        `/api/patients/${parseInt(selected[0].id.split("-")[1])}`
      );
    } else if (selected.length > 1) {
      const extractedID = selected.map((item) => {
        return extractID(item.id);
      });
      await api.post(`/api/patients/bulk`, {
        listOfId: extractedID,
      });
    }
    handleClose();
    setSelected([]);
    getData();
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
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
      <CustomTable
        tableName="Patient"
        headCells={headCells}
        rows={rows}
        onDelete={handleClickOpen}
        enableMultipleDelete={true}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteItem} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientTable;
