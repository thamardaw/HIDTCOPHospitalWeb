import { selector } from "recoil";
import authAtom from "./atom";
import jwt_decode from "jwt-decode";

const authWithUser = selector({
  key: "authWithUser",
  get: ({ get }) => {
    const authTokens = get(authAtom);
    if (authTokens) {
      return jwt_decode(authTokens.access_token);
    }
    return null;
  },
  set: ({ get, set }, newValue) => {
    set(authAtom, newValue);
  },
});

export default authWithUser;
