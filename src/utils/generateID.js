export const generateID = (id, created_time) => {
  let idStr = "" + id;
  const pad = "00000";
  let ID = `DGL-${pad.substring(0, pad.length - idStr.length) + idStr}-${
    created_time.split("-")[0]
  }`;
  return ID;
};
