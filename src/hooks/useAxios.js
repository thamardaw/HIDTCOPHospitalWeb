import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useRecoilState, useSetRecoilState } from "recoil";
import authAtom from "../recoil/auth";
import { withAlert } from "../recoil/snackbar";
import { useHistory } from "react-router-dom";

const baseURL = process.env.REACT_APP_BASE_URL;

const useAxios = (props) => {
  const [auth, setAuth] = useRecoilState(authAtom);
  const openAlert = useSetRecoilState(withAlert);
  const history = useHistory();

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${auth?.access_token}` },
    validateStatus: function (status) {
      return status < 500;
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(auth.access_token);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const res = await axios.post(
      `${baseURL}/api/refreshToken`,
      {
        refresh_token: auth.refresh_token,
      },
      {
        validateStatus: function (status) {
          return status < 500;
        },
      }
    );
    if (res.status === 200) {
      localStorage.setItem("genesis-auth-tokens", JSON.stringify(res.data));
      setAuth(res.data);
      req.headers.Authorization = `Bearer ${res.data.access_token}`;
    } else {
      setAuth(null);
      localStorage.removeItem("genesis-auth-tokens");
      history("/login");
    }
    return req;
  });

  axiosInstance.interceptors.response.use((res) => {
    if (res.config.method !== "get") {
      if (props?.autoSnackbar) {
        if (res.status === 200) {
          openAlert({ status: res.status, detail: res.data.detail });
        } else {
          if (res.status === 422) {
            openAlert({ status: res.status, detail: res.data.detail[0].msg });
          } else {
            openAlert({ status: res.status, detail: res.data.detail });
          }
        }
      }
    }
    return res;
  });
  return axiosInstance;
};

export default useAxios;
