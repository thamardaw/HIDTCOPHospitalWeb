import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

const StyledBox = styled("div")(
  ({ theme, padding = "10px", marginv = "10px" }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    margin: `${marginv} 0`,
    padding: padding,
    "&:hover": {
      backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
  })
);

const DetailsRow = ({
  leftWidth = "30%",
  rightWidth = "70%",
  textVariant = "body2",
  padding,
  marginV,
  name,
  value,
}) => {
  return (
    <StyledBox padding={padding} marginv={marginV}>
      <Box sx={{ width: leftWidth }}>
        <Typography variant={textVariant} sx={{ fontWeight: "bold" }}>
          {name}
        </Typography>
      </Box>
      <Box
        sx={{
          width: `calc(${rightWidth} - 5px)`,
          marginLeft: "5px",
          wordWrap: "break-word",
        }}
      >
        <Typography variant={textVariant}>{value}</Typography>
      </Box>
    </StyledBox>
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
