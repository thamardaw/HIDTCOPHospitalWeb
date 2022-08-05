import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const BackButton = ({ backFunction }) => {
  return (
    <IconButton
      sx={{
        color: "white",
        backgroundColor: "primary.main",
        borderRadius: "10%",
        "&:hover": {
          backgroundColor: "primary.light",
        },
        marginRight: "10px",
      }}
      onClick={backFunction}
      size="small"
    >
      <ArrowBackIosNewIcon size="small" />
    </IconButton>
  );
};

BackButton.propTypes = {
  backFunction: PropTypes.func.isRequired,
};

export default BackButton;
