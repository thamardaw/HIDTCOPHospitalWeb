import { selector } from "recoil";
import billFormAtom from "./atom";

const billFormWithCurrentPatient = selector({
  key: "billFormWithCurrentPatient",
  get: ({ get }) => {
    const billForm = get(billFormAtom);
    return billForm.currentPatient;
  },
  set: ({ get, set }, newValue) => {
    const billForm = get(billFormAtom);
    set(billFormAtom, {
      ...billForm,
      currentPatient: newValue,
    });
  },
});

export default billFormWithCurrentPatient;
