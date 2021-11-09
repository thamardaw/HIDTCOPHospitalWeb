import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { CustomTable } from "../../components";
import { useAxios } from "../../hooks";
import { generateID } from "../../utils/generateID";

// const ButtonContainer = styled(Box)(({ theme }) => ({
//   [theme.breakpoints.down("md")]: {
//     display: "none",
//   },
// }));

// function createData(id, name, gender, dataOfBirth, age, address, contact) {
//   return {
//     id,
//     name,
//     age,
//     contact,
//     gender,
//     dataOfBirth,
//     address,
//   };
// }

// const rows = [
//   createData(
//     "DGL-0001-2021",
//     "Ye Yint Aung",
//     "Male",
//     "1997-03-02",
//     24,
//     "Yangon, Insein Township",
//     "09798865233"
//   ),
//   createData(
//     "DGL-0002-2021",
//     "Zay Maw",
//     "Male",
//     "2003-03-02",
//     18,
//     "Yangon, Hlaing Township",
//     "09798865233"
//   ),
//   createData(
//     "DGL-0003-2021",
//     "Aye Hla",
//     "Female",
//     "2005-03-02",
//     16,
//     "Yangon, Tharkayta Township",
//     "09654865288"
//   ),
//   createData(
//     "DGL-0004-2021",
//     "Kyaw Kyaw",
//     "Male",
//     "2000-03-02",
//     21,
//     "Yangon, Sanchaung Township",
//     "09798005233"
//   ),
//   createData(
//     "DGL-0005-2021",
//     "Aye Aung",
//     "Male",
//     "2002-03-27",
//     19,
//     "Yangon, Hlaing Township",
//     "09798865233"
//   ),
//   createData(
//     "DGL-0006-2021",
//     "Aye Hla",
//     "Female",
//     "2005-03-02",
//     16,
//     "Yangon, Tharkayta Township",
//     "09654865288"
//   ),
//   createData(
//     "DGL-0007-2021",
//     "Ye Yint Aung",
//     "Male",
//     "2021-03-02",
//     24,
//     "Yangon, Insein Township",
//     "09798865233"
//   ),
//   createData(
//     "DGL-0008-2021",
//     "Zay Maw",
//     "Male",
//     "2005-03-02",
//     16,
//     "Yangon, Hlaing Township",
//     "09798865233"
//   ),
//   createData(
//     "DGL-0009-2021",
//     "Aye Hla",
//     "Female",
//     "2005-03-02",
//     16,
//     "Yangon, Tharkayta Township",
//     "09654865288"
//   ),
// ];

const headCells = [
  {
    id: "id",
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
];
const PatientTable = () => {
  const api = useAxios();
  const [rows, setRows] = useState([]);

  const getData = useCallback(async () => {
    const res = await api.get("/api/patients");
    console.log(res.data);
    const data = res.data.map((row) => {
      const ID = generateID(row.id, row.created_time);
      return {
        id: ID,
        name: row.name,
        age: row.age,
        contactDetails: row.contact_details,
        gender: row.gender,
        dataOfBirth: row.date_of_birth,
        address: row.address,
      };
    });
    setRows(data);
  }, [api]);

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
      <CustomTable headCells={headCells} rows={rows} />
    </Box>
  );
};

export default PatientTable;
