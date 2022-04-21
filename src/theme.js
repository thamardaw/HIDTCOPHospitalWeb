import { createTheme } from "@mui/material/styles";
import { constants } from "./utils/constants";

export const theme = createTheme({
  palette: {
    primary: {
      main: constants.primary_color,
    },
  },
});
