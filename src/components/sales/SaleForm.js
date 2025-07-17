import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComprobanteVenta from "./ComprobanteVenta";
import axios from "axios";
import "./sales.scss";
import { getProducts } from "../../redux/features/product/productSlice";



const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const SaleForm = ({ onVentaRegistrada }) => {
  const dispatch = useDispatch();
  const products = useSelector(state => state.product.products);
  useEffect(() => {
    if (!products.length) {
      dispatch(getProducts());
    }
  }, [dispatch, products.length]);
  const [selected, setSelected] = useState(() => {
    // Recupera la selección previa (si existe) del localStorage
    const saved = localStorage.getItem("selectedProducts");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [comprobante, setComprobante] = useState(null);


  useEffect(() => {
    localStorage.setItem("selectedProducts", JSON.stringify(selected));
  }, [selected]);

  const handleAdd = (product) => {
    setSelected([...selected, { ...product, cantidad: 1 }]);
  };

  const handleCantidad = (idx, val) => {
    setSelected(selected.map((item, i) =>
      i === idx ? { ...item, cantidad: Math.max(Number(val), 1) } : item
    ));
  };

  const handleRemove = (idx) => {
    setSelected(selected.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) return;
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/sales`, {
        items: selected.map(item => ({
          productId: item._id,
          quantity: item.cantidad,
        })),
      }, { withCredentials: true });
      setComprobante([...selected]); // Guarda los productos vendidos
      setSelected([]);
      onVentaRegistrada && onVentaRegistrada();
      alert("¡Venta registrada!");
    } catch (err) {
      alert("Error: " + (err?.response?.data?.msg || "No se pudo registrar la venta"));
    }
    setLoading(false);
  };
  const [search, setSearch] = useState("");


  return (
    <form className="sale-form sales-section" onSubmit={handleSubmit} style={{ background: "#f8fafc", padding: 12, borderRadius: 12, marginBottom: 22 }}>
      <h3>Registrar Venta</h3>
     <div>
        <label>Selecciona productos:</label>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: "7px 12px",
              borderRadius: "6px",
              border: "1.1px solid #bfc9df",
              fontSize: "1.07rem",
              width: "100%",
              marginBottom: "10px"
            }}
          />
        </div>
        <ul>
          {products
            .filter(p => p.quantity > 0 && p.name.toLowerCase().includes(search.toLowerCase()))
            .map(p => (
              <li key={p._id}>
                <b>{p.name}</b> <span style={{ color: "#7198e7" }}>({p.category})</span> (Stock: {p.quantity})
                <button type="button" onClick={() => handleAdd(p)} disabled={selected.some(s => s._id === p._id)}>
                  Agregar
                </button>
              </li>
            ))}
        </ul>
      </div>

      <div>
        <h4>Productos seleccionados:</h4>
        {selected.map((item, idx) => (
          <div key={item._id} style={{ marginBottom: 4 }}>
            <b>{item.name}</b> <span style={{ color: "#7198e7" }}>({item.category})</span> - s/{item.price} x
            <input type="number" min="1" max={item.quantity}
              value={item.cantidad}
              onChange={e => handleCantidad(idx, e.target.value)} style={{ width: 45, marginLeft: 4, marginRight: 4 }} />
            <button type="button" onClick={() => handleRemove(idx)}>Quitar</button>
          </div>
        ))}
      </div>
      <div className="sale-total">
        <b>Total: s/{selected.reduce((t, i) => t + i.price * i.cantidad, 0)}</b>
      </div>
      <button type="submit" disabled={loading || selected.length === 0}>
        {loading ? "Registrando..." : "Registrar Venta"}
      </button>
      {comprobante && (
      <ComprobanteVenta productos={comprobante} onClose={() => setComprobante(null)} />
    )}
    </form>
  );
};

export default SaleForm;
