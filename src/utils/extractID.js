export const extractID = (generatedID) => {
  const id = generatedID.split("-")[1];
  return parseInt(id);
};
