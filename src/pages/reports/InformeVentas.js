import React, { useState, useEffect, useRef } from "react";
import { createReport } from "../../services/reportService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getSales } from "../../services/saleService";
import "../../components/reports/reportes.scss";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import SalesChart from "../../components/sales/SalesChart";

const InformeVentas = () => {
  const navigate = useNavigate();
  const chartRef = useRef();
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);
  const [nombreInforme, setNombreInforme] = useState("");
  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [ruc, setRuc] = useState("");
  const [periodo, setPeriodo] = useState({ desde: "", hasta: "" });
  const [ventas, setVentas] = useState([]);
  const [pdfBase64, setPdfBase64] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");

  // Guarda en localStorage
  useEffect(() => {
    localStorage.setItem("pdfFormData", JSON.stringify({
      nombreInforme, nombreEmpresa, ruc, direccion, telefono, periodo,
    }));
  }, [nombreInforme, nombreEmpresa, ruc, direccion, telefono, periodo]);

  useEffect(() => {
    const data = localStorage.getItem("pdfFormData");
    if (data) {
      const parsed = JSON.parse(data);
      setNombreInforme(parsed.nombreInforme || "");
      setNombreEmpresa(parsed.nombreEmpresa || "");
      setRuc(parsed.ruc || "");
      setDireccion(parsed.direccion || "");
      setTelefono(parsed.telefono || "");
      setPeriodo(parsed.periodo || { desde: "", hasta: "" });
    }
  }, []);

  useEffect(() => {
    if (periodo.desde && periodo.hasta) {
      getSales(periodo.desde, periodo.hasta).then(setVentas);
    }
  }, [periodo]);

  const handleCampo = campo => e => {
    setCambiosPendientes(true);
    if (campo === "nombreInforme") setNombreInforme(e.target.value);
    if (campo === "nombreEmpresa") setNombreEmpresa(e.target.value);
    if (campo === "direccion") setDireccion(e.target.value);
    if (campo === "telefono") setTelefono(e.target.value);
    if (campo === "ruc") setRuc(e.target.value);
  };
  const handlePeriodo = parte => e => {
    setCambiosPendientes(true);
    setPeriodo(p => ({ ...p, [parte]: e.target.value }));
  };

  // Actualiza PDF y captura gráfico invisible
  const handleActualizarPDF = async () => {
    setGenerandoPDF(true);
    await handleGenerarPDF();
    setGenerandoPDF(false);
    setCambiosPendientes(false);
  };

  const handleGenerarPDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(nombreEmpresa, 14, 16);
    doc.setFontSize(12);
    doc.text(`RUC: ${ruc}`, 14, 26);
    doc.text(`Periodo: ${periodo.desde} a ${periodo.hasta}`, 14, 34);

    autoTable(doc, {
      startY: 42,
      head: [["Fecha", "Productos", "Total"]],
      body: ventas.map(v => [
        new Date(v.date).toLocaleDateString(),
        v.items.map(i => i.product.name + " x" + i.quantity).join(", "),
        "S/" + v.total,
      ]),
    });

    const resumen = getResumen(ventas);
    doc.setFontSize(12);
    doc.text(
      `Categoría más vendida: ${resumen.categoriaMasVendida || "N/A"}`,
      14,
      doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 55
    );
    const ventasPorCatText = Object.entries(resumen.ventasPorCategoria || {})
      .map(([cat, cant]) => `${cat}: ${cant} ventas`).join(", ");
    doc.text(
      `Ventas por categoría: ${ventasPorCatText}`,
      14,
      doc.lastAutoTable ? doc.lastAutoTable.finalY + 18 : 63
    );
    doc.text(
      `Producto más vendido: ${resumen.productoMasVendido || "N/A"}`,
      14,
      doc.lastAutoTable ? doc.lastAutoTable.finalY + 26 : 71
    );

    // CAPTURA GRÁFICO
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");
      const y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 36 : 100;
      doc.addImage(imgData, "PNG", 12, y, 180, 60);
    }

    // PDF a base64
    const pdfBlob = doc.output("blob");
    const reader = new FileReader();
    reader.onloadend = () => setPdfBase64(reader.result.split(",")[1]);
    reader.readAsDataURL(pdfBlob);
  };

  // Guardar informe en backend
  const handleGuardar = async () => {
    setGuardando(true);
    const resumen = getResumen(ventas);
    try {
      await createReport({
        nombreInforme,
        periodo,
        datosEmpresa: { nombre: nombreEmpresa, ruc, direccion, telefono },
        resumen,
        pdfBase64,
      });
      alert("Informe guardado correctamente");
    } catch (error) {
      alert("No se pudo guardar. Revisa la terminal del backend para más detalles.");
      console.error(error);
    }
    setGuardando(false);
  };

  function getResumen(ventas) {
    const ventasTotales = ventas.length;
    const categoriaCounter = {};
    const productoCounter = {};
    ventas.forEach(v => {
      v.items.forEach(item => {
        const categoria = item.product?.category ?? "Sin categoría";
        const producto = item.product?.name ?? "Sin nombre";
        const cantidad = item.quantity ?? 0;
        categoriaCounter[categoria] = (categoriaCounter[categoria] || 0) + cantidad;
        productoCounter[producto] = (productoCounter[producto] || 0) + cantidad;
      });
    });
    let categoriaMasVendida = null, maxCat = 0;
    for (let cat in categoriaCounter) if (categoriaCounter[cat] > maxCat) { maxCat = categoriaCounter[cat]; categoriaMasVendida = cat; }
    let productoMasVendido = null, maxProd = 0;
    for (let prod in productoCounter) if (productoCounter[prod] > maxProd) { maxProd = productoCounter[prod]; productoMasVendido = prod; }
    return {
      ventasTotales,
      categoriaMasVendida,
      ventasPorCategoria: categoriaCounter,
      productoMasVendido,
      productoCounter,
    };
  }

  return (
    <div className="informe-ventas-layout" style={{display: "flex", gap: 24}}>
      {/* CAPTURA INVISIBLE DEL GRÁFICO */}
      <div style={{ position: "absolute", left: -9999, top: 0, width: 620, height: 260, pointerEvents: "none", opacity: 0 }}>
        <SalesChart ref={chartRef} periodo={periodo} />
      </div>
      {/* FORMULARIO IZQUIERDA */}
      <div className="informe-form" style={{
        flex: 1, background: "#fff", borderRadius: "14px", boxShadow: "0 4px 24px #0001", padding: 24, minWidth: 340, maxWidth: 430
      }}>
        <h2 style={{marginBottom:10, color:"#3953a7"}}>Informe PDF de Ventas</h2>
        <label>Nombre del informe:
          <input type="text" value={nombreInforme} onChange={handleCampo("nombreInforme")} placeholder="Ej: Informe de Ventas" />
        </label>
        <label>Nombre empresa:
          <input type="text" value={nombreEmpresa} onChange={handleCampo("nombreEmpresa")} placeholder="Ej: Mi Empresa S.A.C." />
        </label>
        <label>Dirección:
          <input type="text" value={direccion} onChange={handleCampo("direccion")} placeholder="Ej: Av. Principal 123" />
        </label>
        <label>Teléfono:
          <input type="text" value={telefono} onChange={handleCampo("telefono")} placeholder="Ej: 999999999" />
        </label>
        <label>RUC:
          <input type="text" value={ruc} onChange={handleCampo("ruc")} placeholder="Ej: 123456789" />
        </label>
        <label>Desde:
          <input type="date" value={periodo.desde} onChange={handlePeriodo("desde")} />
        </label>
        <label>Hasta:
          <input type="date" value={periodo.hasta} onChange={handlePeriodo("hasta")} />
        </label>
        {ventas.length > 0 && (
          <div style={{
            background: "#f7f9fd", borderRadius: "8px",
            margin: "0 0 1.2em 0", padding: "1em", fontSize: "1em"
          }}>
            <strong>Categoría más vendida:</strong> {getResumen(ventas).categoriaMasVendida || "N/A"} <br />
            <strong>Ventas por categoría:</strong>
            <ul style={{margin: 0, padding: "0.3em 1em"}}>
              {Object.entries(getResumen(ventas).ventasPorCategoria || {}).map(([cat, cantidad]) =>
                <li key={cat}>{cat}: {cantidad} ventas</li>
              )}
            </ul>
            <strong>Producto más vendido:</strong> {getResumen(ventas).productoMasVendido || "N/A"}
          </div>
        )}
        <button className="btn-vista-previa"
          onClick={handleActualizarPDF}
          disabled={generandoPDF || !cambiosPendientes || ventas.length === 0}>
          {generandoPDF ? "Actualizando..." : "Actualizar vista previa"}
        </button>
        {ventas.length === 0 && (
          <p style={{ color: "red" }}>No hay ventas registradas en el rango de fechas seleccionado.</p>
        )}
        <button className="btn-guardar-informe"
          onClick={handleGuardar}
          disabled={guardando || !pdfBase64}>
          {guardando ? "Guardando..." : "Guardar informe"}
        </button>
        <button style={{
          marginTop: "1.5em", background: "#f1f1f7", color: "#4573f5", fontWeight: "600",
          padding: "0.7em 1.4em", borderRadius: "6px", border: "none", cursor: "pointer"
        }}
          onClick={() => navigate("/dashboard")}
        >← Volver al Dashboard</button>
      </div>
      {/* VISTA PREVIA PDF DERECHA */}
      <div className="informe-ventas-preview" style={{
        flex: 2, background: "#f9fafd", borderRadius: "14px", boxShadow: "0 2px 12px #0001", padding: "18px 24px", marginLeft: 8, minWidth: 440
      }}>
        <h3 style={{marginTop:4}}>Vista Previa PDF</h3>
        {generandoPDF && <div className="spinner-circular"></div>}
        {!generandoPDF && pdfBase64 && (
          <iframe
            src={`data:application/pdf;base64,${pdfBase64}`}
            style={{
              width: "100%",
              height: "70vh",
              border: "none",
              marginTop: "14px",
              borderRadius: "8px"
            }}
            title="PDF Preview"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default InformeVentas;
