import { HttpService } from "../HttpNoTokenRequired/HttpService";

export const commonService = () => {
  const { post, get } = HttpService();


  const startLogIn = (body) => {
    const url = `/api/login`;
    return post(url, body, "login", {});
  };

  const restorePassword = (body) => {
    const url = `/api/newPassword`;
    return post(url, body, "newPassword", {});
  };

  const getRefreshToken = () => {
    const url = `/api/refresh_token`;
    return get(url, "refreshToken", {});
  };

  const registerNewAccount = (body) => {
    const url = `/api/register`;
    return post(url, body,"register", {});
  };


  return {
    startLogIn,
    restorePassword,
    getRefreshToken,
    registerNewAccount
  };
};
