// src/components/EditProduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Snackbar, Alert, Box, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams(); // ID del producto para editar
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/products/${id}`);
                const productData = response.data;
                setProduct(productData);
                setName(productData.name);
                setQuantity(productData.quantity);
                setPrice(productData.price);
                setDescription(productData.description);
            } catch (error) {
                console.error('Error fetching product:', error);
                setSnackbarMessage('Error al obtener producto');
                setOpenSnackbar(true);
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/products/${id}`, {
                name,
                quantity: parseInt(quantity),
                price: parseFloat(price),
                description,
                dateUpdated: new Date().toISOString()
            });
            setSnackbarMessage('Producto actualizado con éxito');
            setOpenSnackbar(true);
            navigate('/view'); // Redirige a la lista de productos
        } catch (error) {
            console.error('Error updating product:', error);
            setSnackbarMessage('Error al actualizar producto');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (!product) return <Typography variant="h6">Cargando...</Typography>;

    return (
        <Box>
            <Typography variant="h4">Editar Producto</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nombre"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    label="Cantidad"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <TextField
                    label="Precio"
                    type="number"
                    fullWidth
                    margin="normal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <TextField
                    label="Descripción"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Actualizar Producto
                </Button>
            </form>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                action={
                    <Button color="inherit" onClick={handleCloseSnackbar}>
                        Cerrar
                    </Button>
                }
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('éxito') ? 'success' : 'error'}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EditProduct;
