import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, Card, CardContent, CardActions, Button } from '@mui/material';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Box>
            {products.map((product) => (
                <Card key={product._id} sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography>Quantity: {product.quantity}</Typography>
                        <Typography>Price: ${product.price}</Typography>
                        <Typography>Registered At: {new Date(product.dateAdded).toLocaleString()}</Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" color="primary">
                            Edit
                        </Button>
                        <Button size="small" color="error">
                            Delete
                        </Button>
                    </CardActions>
                </Card>
            ))}
        </Box>
    );
};

export default ProductList;
