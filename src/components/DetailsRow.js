import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

const DetailsRow = ({
  leftWidth = "30%",
  rightWidth = "70%",
  textVariant = "body2",
  name,
  value,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        margin: "10px 0px",
      }}
    >
      <Box sx={{ width: leftWidth }}>
        <Typography variant={textVariant} sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
      </Box>
      <Box sx={{ width: rightWidth }}>
        <Typography variant={textVariant}>{value}</Typography>
      </Box>
    </Box>
  );
};

DetailsRow.propTypes = {
  leftWidth: PropTypes.string,
  rightWidth: PropTypes.string,
  textVariant: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
};

export default DetailsRow;
