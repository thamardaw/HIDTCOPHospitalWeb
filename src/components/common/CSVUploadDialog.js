import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { CSVLink } from "react-csv";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useAxios } from "../../hooks";
// import { arrayEquals } from "../utils/arrayEquals";
import { withAlert } from "../../recoil/snackbar";
import { LoadingButton } from "@mui/lab";
import { useSetRecoilState } from "recoil";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Form = styled("form")(({ theme }) => ({}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const CSVUploadDialog = ({
  open,
  handleClose,
  columns,
  endpoint,
  template_file_name = `genesis.csv`,
  example_rows = [],
}) => {
  const api = useAxios({ autoSnackbar: false });
  const [CSV, setCSV] = useState({
    data: example_rows,
    headers: [],
    filename: template_file_name,
  });
  const [columnNames, setColumnNames] = useState([]);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState([]);
  const openAlert = useSetRecoilState(withAlert);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const processResponse = (res) => {
    const key = /\([^)]*\)/i;
    const value = /\([0-9]+\)/i;
    if (res.status === 200) {
      openAlert({ status: res.status, detail: res.data.detail });
      handleClose();
    } else if (res.status === 422) {
      const errors = res.data.detail.map((error) => {
        return `Row ${error.loc[1] + 2} - Column ${error.loc[2]} : ${
          error.msg
        }`;
      });
      setErrors(errors);
    } else if (
      res.status === 400 &&
      res.data.detail.match(key) &&
      res.data.detail.match(value)
    ) {
      setErrors([
        `${res.data.detail.match(key)[0]} - ${
          res.data.detail.match(value)[0]
        } does not exist.`,
      ]);
    } else {
      openAlert({
        status: res.status,
        detail: res.data.message || res.data.detail,
      });
    }
    fileInputRef.current.value = null;
  };

  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );
    if (!headers.every((h) => columnNames.includes(h))) {
      openAlert({
        status: 400,
        detail: "Incorrect format.",
      });
      fileInputRef.current.value = null;
      return;
    }

    // if (!arrayEquals(headers, columnNames)) {
    //   openAlert({ status: 400, detail: "Incorrect format."});
    //   fileInputRef.current.value = null;
    //   return;
    // }

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length === headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] === '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] === '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }
        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }
    setData(list);
  };

  const handleFileUpload = (e) => {
    setErrors([]);
    setLoading(false);
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  const upload = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await api.post(endpoint, data);
    processResponse(res);
    setLoading(false);
  };

  useEffect(() => {
    setColumnNames(columns);
    const h = columns.map((column) => {
      return { label: column, key: column };
    });
    setCSV((C) => {
      return {
        ...C,
        headers: h,
      };
    });
  }, [columns]);

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth={true}
      maxWidth="sm"
    >
      <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        Upload File
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Form onSubmit={upload}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <CSVLink
              {...CSV}
              style={{
                color: "inherit",
                textDecoration: "inherit",
              }}
            >
              <Button variant="outlined" fullWidth>
                Download Template
              </Button>
            </CSVLink>
            {/* <Alert severity="info">This is an info alert — check it out!</Alert> */}
            <TextField
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileUpload}
              name="Select File"
              required
              inputRef={fileInputRef}
            />
            {errors.map((error) => (
              <Alert severity="error" key={error}>
                {error}
              </Alert>
            ))}
            <LoadingButton loading={loading} variant="contained" type="submit">
              Upload
            </LoadingButton>
          </Box>
        </Form>
      </DialogContent>
    </BootstrapDialog>
  );
};

CSVUploadDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  endpoint: PropTypes.string.isRequired,
  template_file_name: PropTypes.string.isRequired,
  example_rows: PropTypes.array,
};

export default CSVUploadDialog;
