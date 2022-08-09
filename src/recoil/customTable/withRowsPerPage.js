import { selectorFamily } from "recoil";
import customTableAtomFamily from "./atom";

const customTableWithRowsPerPage = selectorFamily({
  key: "customTableWithRowsPerPage",
  get:
    (id) =>
    ({ get }) => {
      const customTableAtom = get(customTableAtomFamily(id));
      return customTableAtom.rowsPerPage;
    },
  set:
    (id) =>
    ({ get, set }, newValue) => {
      const customTableAtom = get(customTableAtomFamily(id));
      set(customTableAtomFamily(id), {
        ...customTableAtom,
        rowsPerPage: newValue,
      });
    },
});

export default customTableWithRowsPerPage;
