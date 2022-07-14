import { atom } from "recoil";

const authAtom = atom({
  key: "authAtom",
  default: localStorage.getItem("genesis-auth-tokens")
    ? JSON.parse(localStorage.getItem("genesis-auth-tokens"))
    : null,
});

export default authAtom;
