import { HttpService } from "./HttpService";

export const loginService = () => {
  const { post, get } = HttpService();

  const getLogOut = () => {
    const url = `/api/logout`;
    return get(url, "logOut", {});
  };

  const getInfoUser = () => {
    const url = `/api/info`;
    return get(url, "getInfo", {});
  };

  return {
    getLogOut,
    getInfoUser
  };
};
