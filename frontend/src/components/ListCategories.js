// src/components/ListCategories.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Importa el icono de eliminación

const ListCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/categories/${id}`);
            setCategories(categories.filter((category) => category._id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    return (
        <List>
            {categories.map((category) => (
                <ListItem key={category._id} secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(category._id)}>
                        <DeleteIcon />
                    </IconButton>
                }>
                    <ListItemText primary={category.name} />
                </ListItem>
            ))}
        </List>
    );
};

export default ListCategories;
