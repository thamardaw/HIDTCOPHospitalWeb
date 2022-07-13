import { atom } from "recoil";

const authAtom = atom({
  key: "authAtom",
  default: localStorage.getItem("magix-support-auth-tokens")
    ? JSON.parse(localStorage.getItem("magix-support-auth-tokens"))
    : null,
});

export default authAtom;
