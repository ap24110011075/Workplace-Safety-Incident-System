import api from "./api";

export const fetchReports = async () => {
  const response = await api.get("/reports");
  return response.data;
};

export const generatePdfReport = async () => {
  const response = await api.post("/reports/pdf");
  return response.data;
};

export const generateJsonReport = async () => {
  const response = await api.post("/reports/json");
  return response.data;
};
