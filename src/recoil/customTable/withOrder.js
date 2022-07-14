import { selectorFamily } from "recoil";
import customTableAtomFamily from "./atom";

const customTableWithOrder = selectorFamily({
  key: "customTableWithOrder",
  get:
    (id) =>
    ({ get }) => {
      const customTableAtom = get(customTableAtomFamily(id));
      return customTableAtom.order;
    },
  set:
    (id) =>
    ({ get, set }, newValue) => {
      const customTableAtom = get(customTableAtomFamily(id));
      set(customTableAtomFamily(id), {
        ...customTableAtom,
        order: newValue,
      });
    },
});

export default customTableWithOrder;
