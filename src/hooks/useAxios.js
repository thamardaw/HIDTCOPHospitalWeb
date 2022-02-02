import axios from "axios";
import { useContext } from "react";
import { AuthContext, SnackbarContext } from "../contexts";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = process.env.REACT_APP_BASE_URL;

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens, logoutUser } =
    useContext(AuthContext);
  let { openAlert, message } = useContext(SnackbarContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access_token}` },
    validateStatus: function (status) {
      return status < 500;
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authTokens.access_token);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const res = await axios.post(
      `${baseURL}/api/refreshToken`,
      {
        refresh_token: authTokens.refresh_token,
      },
      {
        validateStatus: function (status) {
          return status < 500;
        },
      }
    );
    if (res.status === 200) {
      localStorage.setItem("authTokens", JSON.stringify(res.data));
      setAuthTokens(res.data);
      setUser(jwt_decode(res.data.access_token));
      req.headers.Authorization = `Bearer ${res.data.access_token}`;
    } else {
      logoutUser();
    }
    return req;
  });

  axiosInstance.interceptors.response.use((res) => {
    if (res.config.method !== "get") {
      if (res.status === 200) {
        message({ status: res.status, detail: res.data.detail });
        openAlert(true);
      } else {
        if (res.status === 422) {
          message({ status: res.status, detail: res.data.detail[0].msg });
          openAlert(true);
        } else {
          message({ status: res.status, detail: res.data.detail });
          openAlert(true);
        }
      }
    }
    return res;
  });
  return axiosInstance;
};

export default useAxios;
