import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Modal } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './ViewProducts.css';
import exportLogo from './icons/exportar.png';
import importLogo from './icons/importar.png';
import editLogo from './icons/editar.png';
import deleteLogo from './icons/borrar.png';

const ViewProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [editProduct, setEditProduct] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [searchTerm, setSearchTerm] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState('');
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [csvFile, setCsvFile] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/products');
                const productsWithValidDates = response.data.map(product => {
                    const createdAt = product.dateAdded ? new Date(product.dateAdded) : null;
                    return { ...product, dateAdded: createdAt };
                });
                setProducts(productsWithValidDates);
                setFilteredProducts(productsWithValidDates);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const filterProducts = () => {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = products.filter(product => {
                const matchesName = product.name.toLowerCase().includes(lowercasedTerm);
                const matchesPrice = (minPrice === '' || product.price >= minPrice) &&
                    (maxPrice === '' || product.price <= maxPrice);
                const matchesQuantity = (minQuantity === '' || product.quantity >= minQuantity) &&
                    (maxQuantity === '' || product.quantity <= maxQuantity);
                
                return matchesName && matchesPrice && matchesQuantity;
            });
            setFilteredProducts(filtered);
        };

        filterProducts();
    }, [searchTerm, minPrice, maxPrice, minQuantity, maxQuantity, products]);

    const handleEditProductClick = (product) => {
        setEditProduct(product);
        setDialogOpen(true);
    };

    const handleDeleteProduct = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            setProducts(products.filter(product => product._id !== id));
            setFilteredProducts(filteredProducts.filter(product => product._id !== id));
            setSnackbarMessage('Producto eliminado con éxito');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => setOpenSnackbar(false), 3000);
        } catch (error) {
            console.error('Error deleting product:', error);
            setSnackbarMessage('Error al eliminar producto');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setTimeout(() => setOpenSnackbar(false), 3000);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditProduct(null);
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, editProduct);
            setProducts(products.map(p => (p._id === editProduct._id ? editProduct : p)));
            setFilteredProducts(filteredProducts.map(p => (p._id === editProduct._id ? editProduct : p)));
            handleCloseDialog();
            setSnackbarMessage('Producto actualizado con éxito');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => setOpenSnackbar(false), 3000);
        } catch (error) {
            console.error('Error updating product:', error);
            setSnackbarMessage('Error al actualizar producto');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setTimeout(() => setOpenSnackbar(false), 3000);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    const handleExport = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'products.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error exporting products:', error);
        }
    };

    const handleImport = async () => {
        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            await axios.post('http://localhost:5000/api/products/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
            setFilteredProducts(response.data);
            setImportDialogOpen(false);
            setSnackbarMessage('Productos importados con éxito');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => setOpenSnackbar(false), 3000);
        } catch (error) {
            console.error('Error importing products:', error);
            setSnackbarMessage('Error al importar productos');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            setTimeout(() => setOpenSnackbar(false), 3000);
        }
    };

    return (
        <div className="page-wrapper">
            <header className="header">
                Gestión de Productos
            </header>
            <main className="main-content">
                <div className="actions-container">
                    <div className="action-item" onClick={handleExport} role="button" tabIndex={0}>
                        <img src={exportLogo} alt="Exportar" className="action-icon" />
                        <span className="action-text">Exportar</span>
                    </div>
                    <div className="action-item" onClick={() => setImportDialogOpen(true)} role="button" tabIndex={0}>
                        <img src={importLogo} alt="Importar" className="action-icon" />
                        <span className="action-text">Importar</span>
                    </div>
                </div>
                <div className="filter-section">
                    <Form.Control
                        type="text"
                        placeholder="Buscar por nombre"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="price-quantity-filters">
                        <Form.Control
                            type="number"
                            placeholder="Precio Mínimo"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <Form.Control
                            type="number"
                            placeholder="Precio Máximo"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                        <Form.Control
                            type="number"
                            placeholder="Cantidad Mínima"
                            value={minQuantity}
                            onChange={(e) => setMinQuantity(e.target.value)}
                        />
                        <Form.Control
                            type="number"
                            placeholder="Cantidad Máxima"
                            value={maxQuantity}
                            onChange={(e) => setMaxQuantity(e.target.value)}
                        />
                    </div>
                </div>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Precio</th>
                                <th>Cantidad</th>
                                <th>Categoría</th>
                                <th>Fecha de Registro</th>
                                <th>Código de Barras</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.category?.name || 'Sin categoría'}</td>
                                    <td>{new Date(product.dateAdded).toLocaleString()}</td>
                                    <td>{product.barcode}</td>
                                    <td>
                                        <img
                                            src={editLogo}
                                            alt="Editar"
                                            className="action-icon"
                                            onClick={() => handleEditProductClick(product)}
                                            role="button"
                                            tabIndex={0}
                                        />
                                        <img
                                            src={deleteLogo}
                                            alt="Eliminar"
                                            className="action-icon"
                                            onClick={() => handleDeleteProduct(product._id)}
                                            role="button"
                                            tabIndex={0}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Dialogo de Edición */}
                <Modal show={dialogOpen} onHide={handleCloseDialog}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editar Producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formProductName">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nombre del producto"
                                    value={editProduct?.name || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formProductPrice">
                                <Form.Label>Precio</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Precio del producto"
                                    value={editProduct?.price || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formProductQuantity">
                                <Form.Label>Cantidad</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Cantidad del producto"
                                    value={editProduct?.quantity || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, quantity: e.target.value })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formProductCategory">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Categoría del producto"
                                    value={editProduct?.category?.name || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, category: { name: e.target.value } })}
                                />
                            </Form.Group>
                            <Form.Group controlId="formProductBarcode">
                                <Form.Label>Código de Barras</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Código de barras del producto"
                                    value={editProduct?.barcode || ''}
                                    onChange={(e) => setEditProduct({ ...editProduct, barcode: e.target.value })}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleSaveEdit}>
                                Guardar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                {/* Dialogo de Importación */}
                <Modal show={importDialogOpen} onHide={() => setImportDialogOpen(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Importar Productos</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formFile">
                                <Form.Label>Archivo CSV</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".csv"
                                    onChange={(e) => setCsvFile(e.target.files[0])}
                                />
                            </Form.Group>
                            <Button variant="primary" onClick={handleImport}>
                                Importar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </main>
        </div>
    );
};

export default ViewProducts;
