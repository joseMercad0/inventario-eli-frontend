import React from "react";
import "./sales.scss"; // ¡Así toma el mismo diseño!

const ComprobanteVenta = ({ productos, onClose }) => {
  const total = productos.reduce((t, i) => t + i.price * i.cantidad, 0);
  return (
    <div className="comprobante-venta">
      <div className="comprobante-venta-header">
        <h4>Comprobante de Venta</h4>
        <button onClick={onClose} className="cerrar-comprobante">Cerrar</button>
      </div>
      <table className="comprobante-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.cantidad}</td>
              <td>S/{item.price}</td>
              <td>S/{(item.price * item.cantidad).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="comprobante-total">
        <b>Total: S/{total.toFixed(2)}</b>
      </div>
    </div>
  );
};

export default ComprobanteVenta;
