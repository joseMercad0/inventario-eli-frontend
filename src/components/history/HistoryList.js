import React, { useState } from "react";
import "./HistoryList.scss";

const HistoryList = ({ history = [], onClearHistory }) => {
  const [search, setSearch] = useState("");

  const filteredHistory = history.filter(h =>
    h.details?.toLowerCase().includes(search.toLowerCase()) ||
    h.action?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="history-list">
      <div className="history-header">
        <input
          placeholder="Buscar historial..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={onClearHistory}>Borrar historial</button>
      </div>
      <div className="history-scroll">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Acción</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((h, i) => (
                <tr key={h._id || i}>
                  <td>{new Date(h.createdAt).toLocaleString()}</td>
                  <td>{h.action}</td>
                  <td>{h.details}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "#888" }}>No hay historial.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryList;
