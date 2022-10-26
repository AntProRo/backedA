import { useEffect, useState, createContext } from "react";
import User from "../pages/api/user";
import { commonService } from "../service/HttpNoTokenRequired/commonService";

const initialToken = {
  token: "",
};

export const AuthContext = createContext(initialToken);
export const DataProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const { getRefreshToken } = commonService();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await getRefreshToken();
        if (res.status === 200) {
          setToken(res.data.accessToken);
        }

        setTimeout(() => {
          refreshToken();
        }, 10 * 60 * 1000);
      } catch (err) {
        localStorage.removeItem("firstLogin");
      }
    };
    refreshToken();
  }, []);

  const state = {
    token: [token, setToken],
    User: User(token),
  };

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
