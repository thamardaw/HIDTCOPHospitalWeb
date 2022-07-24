import {Button} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CustomTable, DeleteDialog } from "../../components";
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
  const history = useHistory();
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);

  const getData = useCallback(async () => {
    setIsTableLoading(true);
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
          dataOfBirth: row.date_of_birth || "",
          address: row.address,
          dateAndTime: dateAndTime,
        };
      });
      setRows(data);
      setIsTableLoading(false);
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
    setOpenDeleteDialog(false);
    setSelected([]);
    getData();
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <CustomTable
        tableConfig={{
          headCells: headCells,
          tableName: "Patient",
          maxHeight: "62vh",
          atom: "patientTableAtom",
        }}
        data={rows}
        isLoading={isTableLoading}
        toolbarButtons={{
          whenNoneSelected: [
            {
              id: "patient table new button",
              component: memo(({ ...rest }) => (
                <Button variant="outlined" size="small" {...rest}>
                  New
                </Button>
              )),
              callback: (selected) => {
                history.push("patient/form");
              },
            },
          ],
          whenOneSelected: [
            {
              id: "patient table edit button",
              component: memo(({ ...rest }) => (
                <Button variant="contained" size="small" {...rest}>
                  Edit
                </Button>
              )),
              callback: (selected) => {
                history.push(`patient/form/${extractID(selected[0].id)}`);
              },
            },
            {
              id: "patient table detail button",
              component: memo(({ ...rest }) => (
                <Button
                  variant="contained"
                  size="small"
                  sx={{ marginLeft: "5px" }}
                  {...rest}
                >
                  Details
                </Button>
              )),
              callback: (selected) => {
                history.push(`patient/details/${extractID(selected[0].id)}`);
              },
            },
            {
              id: "patient table delete button",
              component: memo(({ ...rest }) => (
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  sx={{ marginLeft: "5px" }}
                  {...rest}
                >
                  Delete
                </Button>
              )),
              callback: (selected) => {
                setSelected(selected);
                setOpenDeleteDialog(true);
              },
            },
          ],
          whenMoreThanOneSelected: [],
        }}
      />
      <DeleteDialog
        isOpen={openDeleteDialog}
        handleClose={() => setOpenDeleteDialog(false)}
        callback={() => {
          deleteItem();
        }}
      />
    </>
  );
};

export default PatientTable;
