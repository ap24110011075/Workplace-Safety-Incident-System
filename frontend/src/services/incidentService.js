import api from "./api";

export const fetchIncidents = async (params = {}) => {
  const response = await api.get("/incidents", { params });
  return response.data;
};

export const createIncident = async (formData) => {
  const response = await api.post("/incidents", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const updateIncident = async (id, formData) => {
  const response = await api.put(`/incidents/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const deleteIncident = async (id) => {
  const response = await api.delete(`/incidents/${id}`);
  return response.data;
};
