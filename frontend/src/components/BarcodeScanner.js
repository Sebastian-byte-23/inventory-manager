import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BarcodeScanner.css';
import barcodeImage from './barcode.png'; // Asegúrate de tener esta imagen en tu directorio

const BarcodeScanner = () => {
    const [barcode, setBarcode] = useState('');
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const handleBarcodeScan = (event) => {
            if (event.key === 'Enter') {
                fetchProductByBarcode(barcode);
                
            }
        };

        window.addEventListener('keydown', handleBarcodeScan);

        return () => {
            window.removeEventListener('keydown', handleBarcodeScan);
        };
    }, [barcode]);

    const fetchProductByBarcode = async (barcode) => {
        try {
            setError(null); // Limpiar errores anteriores
            const response = await axios.get(`http://localhost:5000/api/products/barcode/${barcode}`);
            if (response.data) {
                setProduct(response.data);
            } else {
                setProduct(null);
                setError('Producto no encontrado.');
            }
        } catch (error) {
            console.error('Error fetching product by barcode:', error);
            setProduct(null);
            setError('Error al buscar el producto.');
        }
    };

    return (
        <div className="mt-4 barcode-scanner">
            <h4>Buscar por codigo de barras</h4>
            <div className="form-group mt-3">
                <label htmlFor="barcode">Código de Barras</label>
                <div className="input-group">
                    <img src={barcodeImage} alt="Código de barras" className="barcode-image" />
                    <input
                        type="text"
                        className="form-control"
                        id="barcode"
                        value={barcode}
                        onChange={(e) => {
                            console.log('Barcode value:', e.target.value); // Añade este log
                            setBarcode(e.target.value);
                        }}
                    />
                </div>
            </div>
            <button
                className="btn btn-primary mt-3"
                onClick={() => fetchProductByBarcode(barcode)}
            >
                Buscar Producto
            </button>
            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}
            {product && (
                <div className="mt-4 product-info">
                    <h6>Información del Producto</h6>
                    <p><strong>Nombre:</strong> {product.name}</p>
                    <p><strong>Cantidad:</strong> {product.quantity}</p>
                    <p><strong>Precio:</strong> ${product.price}</p>
                    <p><strong>Categoría:</strong> {product.category}</p>
                </div>
            )}
        </div>
    );
};

export default BarcodeScanner;
