import { atomFamily } from "recoil";

const tabAtomFamily = atomFamily({
  key: "tabAtomFamily",
  default: 0,
});

export default tabAtomFamily;
