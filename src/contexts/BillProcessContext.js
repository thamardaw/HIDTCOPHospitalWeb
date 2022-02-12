import React, { createContext, useState } from "react";

const BillProcessContext = createContext();

export default BillProcessContext;

export const BillProcessProvider = ({ children }) => {
  const [billProcess, setBillProcess] = useState({
    billItems: [],
    currentPatient: null,
  });

  let contextData = {
    BillProcess: billProcess,
    setBillProcess: setBillProcess,
  };

  return (
    <BillProcessContext.Provider value={contextData}>
      {children}
    </BillProcessContext.Provider>
  );
};
