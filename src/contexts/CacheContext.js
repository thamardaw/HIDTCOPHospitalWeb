import React, { createContext, useState } from "react";

const CacheContext = createContext();

export default CacheContext;

export const CacheProvider = ({ children }) => {
  const [currentPatient, setCurrectPatient] = useState(null);
  const [billItems, setBillItems] = useState([]);

  let contextData = {
    bill_process: {
      currentPatient: currentPatient,
      setCurrectPatient: setCurrectPatient,
      billItems: billItems,
      setBillItems: setBillItems,
    },
  };

  return (
    <CacheContext.Provider value={contextData}>
      {children}
    </CacheContext.Provider>
  );
};
