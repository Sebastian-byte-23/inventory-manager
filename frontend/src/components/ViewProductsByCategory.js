import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewProductsByCategory.css';
import AddCategory from './AddCategory'; // Asegúrate de que AddCategory no use MUI
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const Filament = ({ status }) => {
    let icon;
    let color;

    switch (status) {
        case 'in-stock':
            icon = <CheckCircleOutlined />;
            color = '#28a745'; // Verde para stock disponible
            break;
        case 'low-stock':
            icon = <ExclamationCircleOutlined />;
            color = '#ffc107'; // Amarillo para bajo stock
            break;
        case 'out-of-stock':
            icon = <CloseCircleOutlined />;
            color = '#dc3545'; // Rojo para fuera de stock
            break;
        default:
            icon = <ExclamationCircleOutlined />;
            color = '#6c757d'; // Gris para estado desconocido
    }

    return <span style={{ color }}>{icon}</span>;
};

const ViewProductsByCategory = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editProduct, setEditProduct] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products', {
                    params: { category: selectedCategory }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        if (selectedCategory) {
            fetchProducts();
        } else {
            setProducts([]);
        }
    }, [selectedCategory]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleCloseSnackbar = () => {
        setShowSnackbar(false);
    };

    const handleCategoryAdded = (newCategory) => {
        setCategories([...categories, newCategory]);
        setSelectedCategory(newCategory._id); // Automatically select new category
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditProduct(null);
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, editProduct);
            setProducts(products.map(p => (p._id === editProduct._id ? editProduct : p)));
            handleCloseDialog();
            setSnackbarMessage('Producto actualizado con éxito');
            setShowSnackbar(true);
        } catch (error) {
            console.error('Error updating product:', error);
            setSnackbarMessage('Error al actualizar el producto');
            setShowSnackbar(true);
        }
    };

    const handleDeleteCategory = async () => {
        if (selectedCategory) {
            try {
                await axios.delete(`http://localhost:5000/api/categories/${selectedCategory}`);
                setCategories(categories.filter(category => category._id !== selectedCategory));
                setSelectedCategory('');
                setSnackbarMessage('Categoría eliminada con éxito');
                setShowSnackbar(true);
            } catch (error) {
                console.error('Error deleting category:', error);
                setSnackbarMessage('Error al eliminar la categoría');
                setShowSnackbar(true);
            }
        } else {
            setSnackbarMessage('Selecciona una categoría para eliminar');
            setShowSnackbar(true);
        }
    };

    return (
        <div className="view-products-body">
            <h4>Ver Productos por Categoría</h4>
            <div className="category-select mb-3">
                <label htmlFor="categorySelect" className="form-label">Categoría</label>
                <select
                    id="categorySelect"
                    className="form-select"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">Selecciona una categoría</option>
                    {categories.map(category => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="add-category-section mb-4">
                <AddCategory onCategoryAdded={handleCategoryAdded} />
            </div>
            <button 
                className="btn btn-danger mb-4" 
                onClick={handleDeleteCategory}
                disabled={!selectedCategory}
            >
                Eliminar Categoría
            </button>
            <div className="table-container">
                {products.length ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th>Categoría</th>
                                <th>Registrado</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>${product.price.toFixed(2)}</td>
                                    <td>{product.category ? product.category.name : 'Desconocida'}</td>
                                    <td>{new Date(product.dateAdded).toLocaleString()}</td>
                                    <td><Filament status={product.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-products">No hay productos en esta categoría</div>
                )}
            </div>
            {showSnackbar && (
                <div className={`alert ${snackbarMessage.includes('éxito') ? 'alert-success' : 'alert-danger'} snackbar`} role="alert">
                    {snackbarMessage}
                    <button type="button" className="btn-close" onClick={handleCloseSnackbar}></button>
                </div>
            )}
            {dialogOpen && (
                <div className="modal fade show" style={{ display: 'block' }} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Producto</h5>
                                <button type="button" className="btn-close" onClick={handleCloseDialog} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {editProduct && (
                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="editName" className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                id="editName"
                                                className="form-control"
                                                value={editProduct.name}
                                                onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editQuantity" className="form-label">Cantidad</label>
                                            <input
                                                type="number"
                                                id="editQuantity"
                                                className="form-control"
                                                value={editProduct.quantity}
                                                onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="editPrice" className="form-label">Precio</label>
                                            <input
                                                type="number"
                                                id="editPrice"
                                                className="form-control"
                                                value={editProduct.price}
                                                onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseDialog}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewProductsByCategory;
