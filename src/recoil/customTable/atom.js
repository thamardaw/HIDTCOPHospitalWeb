import { atomFamily } from "recoil";

const customTableAtomFamily = atomFamily({
  key: "customTableAtomFamily",
  default: {
    orderBy: "id",
    rowsPerPage: 25,
    order: "desc",
    page: 0,
  },
});

export default customTableAtomFamily;
