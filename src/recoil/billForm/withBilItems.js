import { selector } from "recoil";
import billFormAtom from "./atom";

const billFormWithBillItems = selector({
  key: "billFormWithBillItems",
  get: ({ get }) => {
    const billForm = get(billFormAtom);
    return billForm.billItems;
  },
  set: ({ get, set }, newValue) => {
    const billForm = get(billFormAtom);
    set(billFormAtom, {
      ...billForm,
      billItems: newValue,
    });
  },
});

export default billFormWithBillItems;
