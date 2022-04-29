import { constants } from "./constants";

export const generateID = (id, created_time) => {
  let idStr = "" + id;
  const pad = "00000";
  if (created_time) {
    let ID = `${constants.name_symbol}-${
      pad.substring(0, pad.length - idStr.length) + idStr
    }-${created_time.split("-")[0]}`;
    return ID;
  }
  return `${constants.name_symbol}-${
    pad.substring(0, pad.length - idStr.length) + idStr
  }`;
};
