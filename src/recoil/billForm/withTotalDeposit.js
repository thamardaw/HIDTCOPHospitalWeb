import { selector } from "recoil";
import billFormAtom from "./atom";

const billFormWithTotalDeposit = selector({
  key: "billFormWithTotalDeposit",
  get: ({ get }) => {
    const billForm = get(billFormAtom);
    return billForm.totalDeposit;
  },
  set: ({ get, set }, newValue) => {
    const billForm = get(billFormAtom);
    set(billFormAtom, {
      ...billForm,
      totalDeposit: newValue,
    });
  },
});

export default billFormWithTotalDeposit;
