import React, { createContext, useCallback, useState } from "react";
// import { useLocation } from "react-router-dom";

const CacheContext = createContext();

export default CacheContext;

export const CacheProvider = ({ children }) => {
  // const location = useLocation();
  const [currentPatient, setCurrentPatient] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [tab, setTab] = useState(0);
  // const path_change = useMemo(
  //   () => location.pathname.split("/")[2],
  //   [location.pathname]
  // );

  const resetTable = useCallback(() => {
    setPage(0);
    setRowsPerPage(25);
    setOrder("desc");
    setOrderBy("id");
  }, []);

  const resetTab = useCallback(() => {
    setTab(0);
  }, []);

  let contextData = {
    bill_process: {
      currentPatient: currentPatient,
      setCurrectPatient: setCurrentPatient,
      billItems: billItems,
      setBillItems: setBillItems,
    },
    table: {
      page: page,
      setPage: setPage,
      rowsPerPage: rowsPerPage,
      setRowsPerPage: setRowsPerPage,
      order: order,
      setOrder: setOrder,
      orderBy: orderBy,
      setOrderBy: setOrderBy,
      resetTable: resetTable,
    },
    viewTab: {
      tab: tab,
      setTab: setTab,
      resetTab: resetTab,
    },
  };

  // useEffect(() => {
  //   setPage(0);
  //   setRowsPerPage(25);
  // }, [path_change]);

  return (
    <CacheContext.Provider value={contextData}>
      {children}
    </CacheContext.Provider>
  );
};
