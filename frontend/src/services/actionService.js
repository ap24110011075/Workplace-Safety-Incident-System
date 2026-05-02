import api from "./api";

export const fetchActions = async () => {
  const response = await api.get("/actions");
  return response.data;
};

export const createAction = async (payload) => {
  const response = await api.post("/actions", payload);
  return response.data;
};

export const updateActionStatus = async (id, payload) => {
  const response = await api.patch(`/actions/${id}`, payload);
  return response.data;
};
