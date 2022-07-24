import { selectorFamily } from "recoil";
import customTableAtomFamily from "./atom";

const customTableWithPage = selectorFamily({
  key: "customTableWithPage",
  get:
    (id) =>
    ({ get }) => {
      const customTableAtom = get(customTableAtomFamily(id));
      return customTableAtom.page;
    },
  set:
    (id) =>
    ({ get, set }, newValue) => {
      const customTableAtom = get(customTableAtomFamily(id));
      set(customTableAtomFamily(id), {
        ...customTableAtom,
        page: newValue,
      });
    },
});

export default customTableWithPage;
