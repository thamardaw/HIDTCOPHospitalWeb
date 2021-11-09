import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../contexts";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";

const baseURL = process.env.REACT_APP_BASE_URL;

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens, logoutUser } =
    useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: { Authorization: `Bearer ${authTokens?.access_token}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(authTokens.access_token);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

    if (!isExpired) return req;

    const res = await axios.post(`${baseURL}/api/refreshToken`, {
      refresh_token: authTokens.refresh_token,
    });

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
  return axiosInstance;
};

export default useAxios;
