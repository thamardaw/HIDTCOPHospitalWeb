import { selector } from "recoil";
import snackbarAtom from "./atom";

const snackbarWithAlert = selector({
  key: "snackbarWithAlert",
  get: ({ get }) => get(snackbarAtom),
  set: ({ get, set }, { isOpen = true, status, detail }) => {
    set(snackbarAtom, {
      isOpen,
      status,
      detail,
    });
  },
});

export default snackbarWithAlert;
