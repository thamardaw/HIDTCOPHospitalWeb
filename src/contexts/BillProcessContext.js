import React, { createContext, useState } from "react";

const BillProcessContext = createContext();

export default BillProcessContext;

export const BillProcessProvider = ({ children }) => {
  const [currentPatient, setCurrectPatient] = useState(null);
  const [billItems, setBillItems] = useState([]);

  let contextData = {
    currentPatient: currentPatient,
    setCurrectPatient: setCurrectPatient,
    billItems: billItems,
    setBillItems: setBillItems,
  };

  return (
    <BillProcessContext.Provider value={contextData}>
      {children}
    </BillProcessContext.Provider>
  );
};
