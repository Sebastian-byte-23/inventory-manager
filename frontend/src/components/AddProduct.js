// src/components/AddProduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useLocation, useNavigate } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [barcode, setBarcode] = useState('');
    const [categories, setCategories] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Obtener el código de barras de la URL
        const query = new URLSearchParams(location.search);
        const barcodeFromQuery = query.get('barcode');
        if (barcodeFromQuery) {
            setBarcode(barcodeFromQuery);
        }

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [location.search]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', {
                name,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                description,
                category,
                barcode
            });
            setSnackbarMessage('Producto agregado con éxito');
            setSnackbarSeverity('success');
            setShowSnackbar(true);
            resetForm();
            setTimeout(() => {
                setShowSnackbar(false);
            }, 3000); // Desaparecer después de 3 segundos
        } catch (error) {
            console.error('Error al agregar producto:', error);
            setSnackbarMessage('Error al agregar producto');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setTimeout(() => {
                setShowSnackbar(false);
            }, 3000); // Desaparecer después de 3 segundos
        }
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    const resetForm = () => {
        setName('');
        setQuantity('');
        setPrice('');
        setDescription('');
        setCategory('');
        setBarcode('');
    };

    return (
        <Container className="add-product-container">
            <h4 className="mb-4">Agregar Producto</h4>
            <Form onSubmit={handleSubmit} className="add-product-form">
                <Form.Group controlId="name" className="form-group">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="quantity" className="form-group">
                    <Form.Label>Cantidad/Stock</Form.Label>
                    <Form.Control
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="price" className="form-group">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="description" className="form-group">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="barcode" className="form-group">
                    <Form.Label>Código de Barras</Form.Label>
                    <Form.Control
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="category" className="form-group">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Control
                        as="select"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Button type="submit" variant="primary" className="submit-btn">
                    Agregar Producto
                </Button>
            </Form>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AddProduct;
