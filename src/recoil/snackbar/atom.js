import { atom } from "recoil";

const snackbarAtom = atom({
  key: "snackbarAtom",
  default: { isOpen: false, status: "", detail: "" },
});

export default snackbarAtom;
