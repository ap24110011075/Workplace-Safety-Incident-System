import api from "./api";

export const fetchUsers = async (params = {}) => {
  const response = await api.get("/users", { params });
  return response.data;
};
