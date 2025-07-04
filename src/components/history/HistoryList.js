import React from 'react';
import './HistoryList.scss'; // Agrega tu archivo SCSS aquí

export default function HistoryList({ history }) {
    return (
        <div className="history-container">
            <h2>Historial de Productos</h2>
            <table className="history-table">
                <thead>
                    <tr>
                        <th>Acción</th>
                        <th>Producto</th>
                        <th>Usuario</th>
                        <th>Fecha</th>
                        <th>Detalles</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item._id}>
                            <td>{item.action.toUpperCase()}</td>
                            <td>{item.product.name}</td>
                            <td>{item.user.name} ({item.user.email})</td>
                            <td>{new Date(item.date).toLocaleString()}</td>
                            <td>{item.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
