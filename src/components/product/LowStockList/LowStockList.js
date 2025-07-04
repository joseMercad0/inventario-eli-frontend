import React from "react";
import "./lowStockList.scss"; // Crea este archivo para estilos únicos (o reusa el de ProductList)

const LowStockList = ({ products }) => {
  const lowStockProducts = products.filter(p => Number(p.quantity) <= 5);

  if (lowStockProducts.length === 0) {
    return (
      <div className="low-stock-list">
        <h4>⚠️ Productos por Agotarse</h4>
        <p className="sin-riesgo">No hay productos en riesgo 🟢</p>
      </div>
    );
  }

  return (
    <div className="low-stock-list">
      <h4>⚠️ Productos por Agotarse</h4>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {lowStockProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>s/{p.price}</td>
              <td style={{ color: "#d10000", fontWeight: "bold" }}>{p.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LowStockList;
