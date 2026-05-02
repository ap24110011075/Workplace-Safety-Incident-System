import api from "./api";

export const fetchDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};
