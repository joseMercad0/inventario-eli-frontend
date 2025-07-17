import axios from "axios";
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api/sales/`;

// Obtener ventas del usuario (puedes pasar fechas para filtrar)
export const getSales = async (from, to) => {
  let url = API_URL;
  if (from && to) url += `?from=${from}&to=${to}`;
  const response = await axios.get(url, { withCredentials: true });
  return response.data;
};

// Si después necesitas registrar ventas, puedes agregar aquí
// export const registerSale = async (items) => {...};
