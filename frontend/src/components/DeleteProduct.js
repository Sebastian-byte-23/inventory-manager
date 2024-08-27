import React from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';

const DeleteProduct = ({ productId, onDelete }) => {
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${productId}`);
            alert('Product deleted successfully');
            onDelete();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button variant="danger" onClick={handleDelete} className="ms-3">
            Delete
        </Button>
    );
};

export default DeleteProduct;
