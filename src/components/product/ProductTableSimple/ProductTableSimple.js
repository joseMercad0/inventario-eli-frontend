// src/components/products/ProductTableSimple.js
import React from "react";
import "./ProductTableSimple.scss";

const ProductTableSimple = ({ products }) => (
  <div className="simple-product-table">
    <h2>Lista de Productos</h2>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Cantidad</th>
        </tr>
      </thead>
      <tbody>
        {products && products.length > 0 ? (
          products.map((p, idx) => (
            <tr key={p._id}>
              <td>{idx + 1}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>S/{p.price}</td>
              <td>{p.quantity}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>No hay productos registrados.</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ProductTableSimple;
