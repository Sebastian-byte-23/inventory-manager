import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ManageProviders.css';
import { Snackbar, Alert } from '@mui/material';

const ManageProviders = () => {
    const [providers, setProviders] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentProvider, setCurrentProvider] = useState(null);
    const [newProvider, setNewProvider] = useState({ name: '', contact: '', address: '', phone: '', email: '' });
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Severity for Snackbar

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/providers');
                setProviders(response.data);
            } catch (error) {
                console.error('Error fetching providers:', error);
            }
        };

        fetchProviders();
    }, []);

    const handleDialogOpen = (provider) => {
        setCurrentProvider(provider);
        setNewProvider(provider || { name: '', contact: '', address: '', phone: '', email: '' });
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setCurrentProvider(null);
    };

    const handleSave = async () => {
        try {
            if (currentProvider) {
                // Edit provider
                await axios.put(`http://localhost:5000/api/providers/${currentProvider._id}`, newProvider);
                setProviders(providers.map(p => (p._id === currentProvider._id ? newProvider : p)));
                setSnackbarMessage('Proveedor actualizado con éxito');
                setSnackbarSeverity('success');
            } else {
                // Add new provider
                await axios.post('http://localhost:5000/api/providers', newProvider);
                setProviders([...providers, newProvider]);
                setSnackbarMessage('Proveedor agregado con éxito');
                setSnackbarSeverity('success');
            }
            setShowSnackbar(true);
            setTimeout(() => setShowSnackbar(false), 3000); // Hide snackbar after 3 seconds
            handleDialogClose();
        } catch (error) {
            console.error('Error saving provider:', error);
            setSnackbarMessage('Error al guardar el proveedor');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setTimeout(() => setShowSnackbar(false), 3000); // Hide snackbar after 3 seconds
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/providers/${id}`);
            setProviders(providers.filter(provider => provider._id !== id));
            setSnackbarMessage('Proveedor eliminado con éxito');
            setSnackbarSeverity('success');
            setShowSnackbar(true);
            setTimeout(() => setShowSnackbar(false), 3000); // Hide snackbar after 3 seconds
        } catch (error) {
            console.error('Error deleting provider:', error);
            setSnackbarMessage('Error al eliminar el proveedor');
            setSnackbarSeverity('error');
            setShowSnackbar(true);
            setTimeout(() => setShowSnackbar(false), 3000); // Hide snackbar after 3 seconds
        }
    };

    return (
        <div className="manage-providers mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Gestionar Proveedores</h4>
                <button className="btn btn-primary" onClick={() => handleDialogOpen(null)}>
                    Agregar Proveedor
                </button>
            </div>
            <div className="card shadow-sm">
                <div className="card-body">
                    <h6 className="card-title">Lista de Proveedores</h6>
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Contacto</th>
                                    <th>Teléfono</th>
                                    <th>Email</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {providers.length ? (
                                    providers.map(provider => (
                                        <tr key={provider._id}>
                                            <td>{provider.name}</td>
                                            <td>{provider.contact}</td>
                                            <td>{provider.phone}</td>
                                            <td>{provider.email}</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-primary me-2"
                                                    onClick={() => handleDialogOpen(provider)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleDelete(provider._id)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No hay proveedores disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={() => setShowSnackbar(false)}
                message={snackbarMessage}
                action={
                    <button onClick={() => setShowSnackbar(false)} style={{ color: 'white' }}>
                        X
                    </button>
                }
            >
                <Alert onClose={() => setShowSnackbar(false)} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            {dialogOpen && (
                <div className="modal fade show" style={{ display: 'block' }} role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{currentProvider ? 'Editar Proveedor' : 'Agregar Proveedor'}</h5>
                                <button type="button" className="close" onClick={handleDialogClose} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="providerName" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        id="providerName"
                                        className="form-control"
                                        value={newProvider.name}
                                        onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="providerContact" className="form-label">Contacto</label>
                                    <input
                                        type="text"
                                        id="providerContact"
                                        className="form-control"
                                        value={newProvider.contact}
                                        onChange={(e) => setNewProvider({ ...newProvider, contact: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="providerAddress" className="form-label">Dirección</label>
                                    <input
                                        type="text"
                                        id="providerAddress"
                                        className="form-control"
                                        value={newProvider.address}
                                        onChange={(e) => setNewProvider({ ...newProvider, address: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="providerPhone" className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        id="providerPhone"
                                        className="form-control"
                                        value={newProvider.phone}
                                        onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="providerEmail" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        id="providerEmail"
                                        className="form-control"
                                        value={newProvider.email}
                                        onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleDialogClose}>Cancelar</button>
                                <button type="button" className="btn btn-primary" onClick={handleSave}>Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageProviders;
