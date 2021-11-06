import { Box } from "@mui/system";
import { CustomTable } from "../../components";

// const ButtonContainer = styled(Box)(({ theme }) => ({
//   [theme.breakpoints.down("md")]: {
//     display: "none",
//   },
// }));

function createData(
  id,
  name,
  calories,
  fat,
  carbs,
  protein1,
  protein2,
  protein3
) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein1,
    protein2,
    protein3,
  };
}

const rows = [
  createData(
    "DGL-0001-2021",
    "Ye Yint Aung",
    "Male",
    "1997-03-02",
    24,
    "Yangon, Insein Township",
    "09798865233",
    "A"
  ),
  createData(
    "DGL-0002-2021",
    "Zay Maw",
    "Male",
    "2003-03-02",
    18,
    "Yangon, Hlaing Township",
    "09798865233",
    "O"
  ),
  createData(
    "DGL-0003-2021",
    "Aye Hla",
    "Female",
    "2005-03-02",
    16,
    "Yangon, Tharkayta Township",
    "09654865288",
    "AB"
  ),
  createData(
    "DGL-0004-2021",
    "Kyaw Kyaw",
    "Male",
    "2000-03-02",
    21,
    "Yangon, Sanchaung Township",
    "09798005233",
    "A"
  ),
  createData(
    "DGL-0005-2021",
    "Aye Aung",
    "Male",
    "2002-03-27",
    19,
    "Yangon, Hlaing Township",
    "09798865233",
    "O"
  ),
  createData(
    "DGL-0006-2021",
    "Aye Hla",
    "Female",
    "2005-03-02",
    16,
    "Yangon, Tharkayta Township",
    "09654865288",
    "AB"
  ),
  createData(
    "DGL-0007-2021",
    "Ye Yint Aung",
    "Male",
    "2021-03-02",
    24,
    "Yangon, Insein Township",
    "09798865233",
    "A"
  ),
  createData(
    "DGL-0008-2021",
    "Zay Maw",
    "Male",
    "2005-03-02",
    16,
    "Yangon, Hlaing Township",
    "09798865233",
    "O"
  ),
  createData(
    "DGL-0009-2021",
    "Aye Hla",
    "Female",
    "2005-03-02",
    16,
    "Yangon, Tharkayta Township",
    "09654865288",
    "AB"
  ),
];

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
    id: "protein1",
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
const PatientTable = () => {
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
      <CustomTable headCells={headCells} rows={rows} />
    </Box>
  );
};

export default PatientTable;
