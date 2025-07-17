import SaleForm from "../../components/sales/SaleForm";
import SalesChart from "../../components/sales/SalesChart";
import SaleHistory from "../../components/sales/SaleHistory";
import { useNavigate } from "react-router-dom";

export default function SalesDashboard() {
  const navigate = useNavigate();
  // Lógica para refrescar productos/ventas si quieres
  return (
    <div>
      <SaleForm />
      <SalesChart />
      <SaleHistory />
       <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
        <button
          onClick={() => navigate("/informe-ventas")}
          style={{
            background: "#4e6cf4",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 28px",
            fontWeight: 600,
            fontSize: "1.08rem",
            boxShadow: "0 2px 8px #4e6cf433",
            cursor: "pointer"
          }}
        >
          Generar Informe de Ventas
        </button>
      </div>
    </div>
  );
}
