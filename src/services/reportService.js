import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/reports/`;

export const createReport = async (reportData) => {
  const response = await axios.post(API_URL, reportData, { withCredentials: true });
  return response.data;
};

export const getReports = async () => {
  const response = await axios.get(API_URL, { withCredentials: true });
  return response.data;
};

export const getReportPDF = async (id) => {
  const response = await axios.get(`${API_URL}${id}/pdf`, { withCredentials: true });
  return response.data;
};

export const deleteReport = async (id) => {
  await axios.delete(`${BACKEND_URL}/api/reports/${id}`, { withCredentials: true });
};
