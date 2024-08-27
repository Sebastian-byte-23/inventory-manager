import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LowStockAlerts.css'; // Asegúrate de tener este archivo CSS para tus estilos

const LowStockAlerts = () => {
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLowStockProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/low-stock-alerts');
                setLowStockProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error fetching low stock products');
                setLoading(false);
            }
        };

        fetchLowStockProducts();
    }, []);

    if (loading) return <div className="spinner-border text-primary" role="status"><span className="sr-only">Loading...</span></div>;
    if (error) return <div className="alert alert-danger" role="alert">{error}</div>;

    return (
        <div className="low-stock-alerts">
            <h3 className="mb-4">Alertas de Stock Bajo</h3>
            {lowStockProducts.length ? (
                <table className="table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Fecha de Alerta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockProducts.map(product => (
                            <tr key={product._id}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>{new Date(product.dateAdded).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay productos con stock bajo.</p>
            )}
        </div>
    );
};

export default LowStockAlerts;
