// src/services/historyService.js
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const getHistory = async () => {
  const response = await axios.get(`${BACKEND_URL}/api/history`, { withCredentials: true });
  return response.data;
};

export const clearHistory = async (token) => {
  // Cambia la URL por la ruta real en tu backend
  return await fetch('/api/history/clear', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

