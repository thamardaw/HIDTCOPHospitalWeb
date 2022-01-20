import React, { createContext, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/system";

const LoadingContext = createContext();

export default LoadingContext;

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  let contextData = {
    isScreenLoading: loading,
    setScreenLoading: setLoading,
  };

  return (
    <LoadingContext.Provider value={contextData}>
      <Box
        sx={{
          width: "100%",
          height: "50vh",
          display: loading ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
      <Box
        sx={{
          display: loading ? "none" : "block",
        }}
      >
        {children}
      </Box>
    </LoadingContext.Provider>
  );
};
