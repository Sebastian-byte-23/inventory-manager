import React, { useState } from 'react';
import axios from 'axios';
import './AddCategory.css'; // Importa el archivo CSS

const AddCategory = ({ onCategoryAdded }) => {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCategoryChange = (event) => {
        setCategoryName(event.target.value);
    };

    const handleAddCategory = async () => {
        if (!categoryName.trim()) {
            setError('El nombre de la categoría no puede estar vacío.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/categories', {
                name: categoryName
            });
            onCategoryAdded(response.data);
            setCategoryName('');
            setError('');
        } catch (error) {
            setError('Error al agregar la categoría. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-category-wrapper">
            <input
                type="text"
                className="form-control"
                placeholder="Nombre de la nueva categoría"
                value={categoryName}
                onChange={handleCategoryChange}
            />
            <button
                className="btn btn-primary"
                onClick={handleAddCategory}
                disabled={loading}
            >
                {loading ? 'Añadiendo...' : 'Agregar Categoría'}
            </button>
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default AddCategory;
