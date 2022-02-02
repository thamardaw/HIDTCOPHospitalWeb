import { createContext, useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { SnackbarContext } from ".";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let { openAlert, message } = useContext(SnackbarContext);
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwt_decode(JSON.parse(localStorage.getItem("authTokens")).access_token)
      : null
  );

  let [loading, setLoading] = useState(true);

  const history = useHistory();

  let loginUser = async (details) => {
    const formData = new FormData();
    formData.append("username", details.username);
    formData.append("password", details.password);
    const res = await axios.post(
      `${process.env.REACT_APP_BASE_URL}/api/login`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        validateStatus: function (status) {
          return status < 500;
        },
      }
    );
    if (res.status === 200) {
      setAuthTokens(res.data);
      setUser(jwt_decode(res.data.access_token));
      localStorage.setItem("authTokens", JSON.stringify(res.data));
      history.push("/");
    } else {
      message({ status: res.status, detail: res.data.detail });
      openAlert(true);
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    history.push("/login");
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwt_decode(authTokens.access_token));
    }
    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
