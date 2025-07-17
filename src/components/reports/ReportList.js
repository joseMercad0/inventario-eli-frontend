import React, { useEffect, useState } from "react";
import { getReports, getReportPDF, deleteReport } from "../../services/reportService";
import "./reportes.scss";

const ReportList = () => {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    getReports()
      .then(setInformes)
      .finally(() => setLoading(false));
  }, []);

  const descargarPDF = async (id, nombre) => {
    try {
      const { pdfBase64 } = await getReportPDF(id);
      const link = document.createElement("a");
      link.href = "data:application/pdf;base64," + pdfBase64;
      link.download = nombre + ".pdf";
      link.click();
      setMessage("¡PDF descargado!");
    } catch {
      setMessage("Error al descargar el PDF.");
    }
  };

  const eliminarInforme = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este informe?")) {
      try {
        await deleteReport(id);
        setInformes(informes => informes.filter(r => r._id !== id));
        setMessage("Informe eliminado correctamente.");
      } catch {
        setMessage("No se pudo eliminar el informe.");
      }
    }
  };

  if (loading) return <div className="loader">Cargando informes...</div>;

  return (
    <div className="report-list">
      <h3>Informes Generados</h3>
      {message && <div className="message">{message}</div>}
      {informes.length === 0 ? (
        <p>No hay informes generados aún.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Periodo</th>
              <th>Fecha</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {informes.map(r => (
              <tr key={r._id}>
                <td>{r.nombreInforme}</td>
                <td>{r.periodo.desde} - {r.periodo.hasta}</td>
                <td>{new Date(r.fechaCreacion).toLocaleDateString()}</td>
                <td>
                  <button className="btn-download" onClick={() => descargarPDF(r._id, r.nombreInforme)}>
                    Descargar PDF
                  </button>
                  <button className="btn-delete" onClick={() => eliminarInforme(r._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="btn-back" onClick={() => window.location.href = "/dashboard"}>
        Volver al Dashboard
      </button>
    </div>
  );
};

export default ReportList;
