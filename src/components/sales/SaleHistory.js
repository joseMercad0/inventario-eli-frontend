import React, { useEffect, useState } from "react";
import axios from "axios";
import "./sales.scss";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SaleHistory = () => {
  const [sales, setSales] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");

  const fetchSales = async () => {
    let url = `${BACKEND_URL}/api/sales`;
    if (from && to) url += `?from=${from}&to=${to}`;
    const res = await axios.get(url, { withCredentials: true });
    setSales(res.data);
  };

  useEffect(() => { fetchSales(); }, [from, to]);

  // Filtro de búsqueda por producto, total, fecha
  const filtered = sales.filter(sale =>
    sale.items.some(item =>
      (item.product?.name || item.name || "").toLowerCase().includes(search.toLowerCase())
    ) ||
    (sale.total?.toString() || "").includes(search) ||
    (new Date(sale.date).toLocaleDateString().includes(search))
  );

  // --- EXPORTAR CSV ---
  const handleExportCSV = () => {
    const rows = filtered.map(sale => ({
      Fecha: new Date(sale.date).toLocaleDateString(),
      Productos: sale.items.map(i => i.name).join(" | "),
      Categoría: sale.items.map(i => i.category).join(" | "),
      Cantidad: sale.items.map(i => i.quantity).join(" | "),
      Total: sale.total,
    }));
    const csv = [
      ["Fecha", "Productos", "Categoría", "Cantidad", "Total"].join(","),
      ...rows.map(row => [row.Fecha, `"${row.Productos}"`, `"${row.Categoría}"`, `"${row.Cantidad}"`, row.Total].join(","))
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "historial_ventas.csv";
    a.click();
  };

  // --- EXPORTAR PDF OPCIONAL ---
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Historial de Ventas", 14, 16);

    autoTable(doc, {
      startY: 24,
      head: [["Fecha", "Producto(s)", "Cantidad", "Categoría", "Total"]],
      body: filtered.map(sale => [
        new Date(sale.date).toLocaleDateString(),
        sale.items.map(i => i.name).join(", "),
        sale.items.map(i => i.quantity).join(", "),
        sale.items.map(i => i.category).join(", "),
        "S/" + sale.total,
      ]),
    });

    doc.save("historial_ventas.pdf");
  };

  return (
    <div className="sales-section" style={{margin: "16px 0"}}>
      <h3>Historial de Ventas</h3>
      <div className="history-header">
        <input
          className="history-search"
          placeholder="Buscar venta, producto, fecha..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button onClick={handleExportCSV} style={{marginLeft: 10}}>Exportar CSV</button>
        <button onClick={handleExportPDF} style={{marginLeft: 10}}>Exportar PDF</button>
      </div>
      <div>
        <label>De: <input type="date" value={from} onChange={e => setFrom(e.target.value)} /></label>
        <label> A: <input type="date" value={to} onChange={e => setTo(e.target.value)} /></label>
        <button onClick={fetchSales}>Buscar</button>
      </div>
      <div className="history-table-scroll" style={{marginTop: 12, maxHeight: 340, overflowY: "auto"}}>
        <table className="sale-history-table" style={{width: "100%"}}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Cantidad</th>
              <th></th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(sale => (
              <tr key={sale._id}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>
                <ul>
                  {sale.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.name || item.name || "—"} 
                      <span style={{color: "#7198e7", fontSize: "0.93em"}}>
                        ({item.product?.category || item.category || "—"})
                      </span>
                    </li>
                  ))}
                </ul>
              </td>

                <td>
                  <ul>
                    {sale.items.map(item => (
                      <li key={item.product?._id || item._id}>{item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td>
                  <ul>
                    {sale.items.map((item, idx) => (
                      <li key={idx}>{item.category}</li>
                    ))}
                  </ul>
                </td>
                <td>s/{sale.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleHistory;
