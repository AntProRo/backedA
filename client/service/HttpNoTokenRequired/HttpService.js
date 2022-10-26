import { useCallback } from "react";
import axios from "axios";

export const HttpService = () => {
  const createRequestOptions = useCallback(
    (method, url, body) => {
      return {
        url: url,
        method: method,
        headers: {
          Accept: "application/json",
        },
        data: body,
      };
    },
    []
  );

  const createRequestOptionsNoBody = useCallback(
    (method, url) => {
      return {
        url: url,
        method: method,
      };
    },
    []
  );

  const fetchProcess = useCallback(async (_, options, name, errorResponse) => {
    let response;
    try {
      const res = await axios(options)
       if (res) {
        return res;
      } 
    } catch (err) {
      response = err.response;
      console.error(name, err);
    }
    return { ...errorResponse, ...response };
  }, []);

  const get = useCallback(
    async (url, name, errorResponse) => {
      const options = createRequestOptionsNoBody("get", url);
      return fetchProcess(url, options, name, errorResponse);
    },
    [createRequestOptionsNoBody, fetchProcess]
  );

  const post = useCallback(
    async (url, body, name, errorResponse) => {
      const options = createRequestOptions("post", url, body);
      return fetchProcess(url, options, name, errorResponse);
    },
    [createRequestOptions, fetchProcess]
  );

  const put = useCallback(
    async (url, body, name, errorResponse) => {
      const options = createRequestOptions("put", url, body);
      return fetchProcess(url, options, name, errorResponse);
    },
    [createRequestOptions, fetchProcess]
  );

  const patch = useCallback(
    async (url, body, name, errorResponse) => {
      const options = createRequestOptions("patch", url, body);
      return fetchProcess(url, options, name, errorResponse);
    },
    [createRequestOptions, fetchProcess]
  );

  const deleteFn = useCallback(
    async (url, name, errorResponse) => {
      const options = createRequestOptions("delete", url);
      return fetchProcess(url, options, name, errorResponse);
    },
    [createRequestOptionsNoBody, fetchProcess]
  );

  return { get, post, put, patch, deleteFn };
};
