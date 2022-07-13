import { selectorFamily } from "recoil";
import customTableAtomFamily from "./atom";

const customTableWithOrderBy = selectorFamily({
  key: "customTableWithOrderBy",
  get:
    (id) =>
    ({ get }) => {
      const customTableAtom = get(customTableAtomFamily(id));
      return customTableAtom.orderBy;
    },
  set:
    (id) =>
    ({ get, set }, newValue) => {
      const customTableAtom = get(customTableAtomFamily(id));
      set(customTableAtomFamily(id), {
        ...customTableAtom,
        orderBy: newValue,
      });
    },
});

export default customTableWithOrderBy;
