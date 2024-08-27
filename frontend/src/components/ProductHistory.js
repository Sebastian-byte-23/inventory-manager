import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Configura un axios instance
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 10000, // Tiempo de espera en milisegundos
    headers: { 'Content-Type': 'application/json' },
});

const ProductHistory = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductHistory = async () => {
            try {
                const response = await api.get(`/product-history/${id}`);
                setProduct(response.data);
                setError(null);
            } catch (error) {
                console.error('Error details:', error);
                setError('Error fetching product history');
                setProduct(null);
            }
        };

        if (id) {
            fetchProductHistory();
        } else {
            setError('Invalid product ID');
        }
    }, [id]);

    if (error) return <div>{error}</div>;
    if (!product) return <div>Loading...</div>;

    return (
        <div>
            <h1>Product History</h1>
            {/* Renderiza el historial del producto aquí */}
        </div>
    );
};

export default ProductHistory;
