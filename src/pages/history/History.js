// src/pages/history/History.js
import React, { useEffect, useState } from "react";
import HistoryList from "../../components/history/HistoryList";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const History = () => {
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/history`, { withCredentials: true });
      setHistory(res.data);
    } catch {
      setHistory([]);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm("¿Borrar todo el historial?")) {
      await axios.delete(`${BACKEND_URL}/api/history`, { withCredentials: true });
      fetchHistory();
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ margin: "32px" }}>
      <h2>Historial de Movimientos</h2>
      <HistoryList history={history} onClearHistory={handleClearHistory} />
    </div>
  );
};

export default History;
