// src/components/PointOfSale.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './PointOfSale.css'; // Importa el archivo CSS

const PointOfSale = () => {
    const [barcode, setBarcode] = useState('');
    const [productData, setProductData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleBarcodeScan = (event) => {
        if (event.key === 'Enter') {
            navigate(`/add-product?barcode=${barcode}`);
            setBarcode(''); // Limpiar el campo de código de barras después de la navegación
        }
    };

    const handleBarcodeChange = (e) => {
        setBarcode(e.target.value);
    };

    return (
        <div className="point-of-sale-container">
            <h1 className="point-of-sale-header">Interfaz de Punto de Venta</h1>
            <input
                type="text"
                placeholder="Código de Barras"
                value={barcode}
                onChange={handleBarcodeChange}
                onKeyDown={handleBarcodeScan}
                className="point-of-sale-text-field"
            />
            <button 
                onClick={() => navigate(`/add-product?barcode=${barcode}`)}
                className="point-of-sale-button"
            >
                Ir a Agregar Producto
            </button>
            {error && <div className="point-of-sale-error-alert">{error}</div>}
            {productData && (
                <div className="point-of-sale-product-details">
                    <h2>Detalles del Producto</h2>
                    <p><strong>Nombre:</strong> {productData.name}</p>
                    <p><strong>Precio:</strong> ${productData.price}</p>
                    <p><strong>Cantidad:</strong> {productData.quantity}</p>
                    <p><strong>Descripción:</strong> {productData.description}</p>
                </div>
            )}
        </div>
    );
};

export default PointOfSale;
