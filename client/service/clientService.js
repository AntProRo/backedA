import { HttpService } from "./HttpService";

export const clientService = () => {
  const { post, get, put, deleteFn } = HttpService();

  const newTechLead = (body) => {
    const url = `/api/newTechLead`;
    return post(url, body, "newTechLead", {});
  };

  const getTechLead = (id) => {
    const url = `/api/getTechLead/${id}`;
    return get(url, "getTechLead", {});
  };

  const updateTechLead = (id, body) => {
    const url = `/api/updateTechLead/${id}`;
    return put(url, body, "updateTechLead", {});
  };
  const deleteTechLead = (id) => {
    const url = `/api/deleteTechLead/${id}`;
    return deleteFn(url, "deleteTechLead", {});
  };

  const newManager = (body) => {
    const url = `/api/newManager`;
    return post(url, body, "newManager", {});
  };

  const getManager = (id) => {
    const url = `/api/getManager/${id}`;
    return get(url, "getManager", {});
  };

  const updateManager = (id, body) => {
    const url = `/api/updateManager/${id}`;
    return put(url, body, "updateManager", {});
  };

  const deleteManager = (id) => {
    const url = `/api/deleteManager/${id}`;
    return deleteFn(url, "deleteManager", {});
  };

  const newClient = (body) => {
    const url = `/api/newClient`;
    return post(url, body, "newClient", {});
  };

  const getClientList = () => {
    const url = `/api/getClient`;
    return get(url, "getClient", {});
  }; 
  const updateClient = (id, body) => {
    const url = `/api/updateClient/${id}`;
    return put(url, body, "updateClient", {});
  };

  const deleteClient = (id) => {
    const url = `/api/deleteClient/${id}`;
    return deleteFn(url, "deleteClient", {});
  };

  return {
    newTechLead,
    getTechLead,
    updateTechLead,
    deleteTechLead,
    newManager,
    getManager,
    updateManager,
    deleteManager,
    newClient,
    getClientList,
    updateClient,
    deleteClient,
  };
};
