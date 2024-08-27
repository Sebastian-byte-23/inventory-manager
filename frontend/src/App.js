// src/App.js
import './App.css';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AddProduct from './components/AddProduct';
import ViewProducts from './components/ViewProducts';
import ViewProductsByCategory from './components/ViewProductsByCategory';
import EditProduct from './components/EditProduct';
import AuthPage from './components/AuthPage';
import Tutorial from './components/Tutorial';
import Sidebar from './components/Sidebar';
import { useAuth } from './contexts/AuthContext';
import ProductHistory from './components/ProductHistory';
import ManageProviders from './components/ManageProviders';
import BarcodeScanner from './components/BarcodeScanner';
import LowStockAlerts from './components/LowStockAlerts';
import PointOfSale from './components/PointOfSale';


const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/" />;
};

const App = () => {
    const { isAuthenticated, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Router>
            <Sidebar open={sidebarOpen} onClose={toggleSidebar} onLogout={logout} />
            <AppBar position="fixed" sx={{ width: '100%', height: '64px', bgcolor: '#343a40' }}>
                <Toolbar sx={{ height: '100%' }}>
                    {isAuthenticated && (
                        <IconButton edge="start" color="inherit" onClick={toggleSidebar} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
                        Gestor de Inventario
                    </Typography>
                    {isAuthenticated && (
                        <IconButton color="inherit" onClick={logout}>
                            <LogoutIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>
            <Container sx={{ mt: 8, maxWidth: 'lg' }}>
                <Routes>
                    <Route path="/" element={<AuthPage />} />
                    <Route path="/add" element={<ProtectedRoute element={<AddProduct />} />} />
                    <Route path="/add-product" element={<ProtectedRoute element={<AddProduct />} />} />
                    <Route path="/view" element={<ProtectedRoute element={<ViewProducts />} />} />
                    <Route path="/view-categories" element={<ProtectedRoute element={<ViewProductsByCategory />} />} />
                    <Route path="/edit/:id" element={<ProtectedRoute element={<EditProduct />} />} />
                    <Route path="/tutorial" element={<ProtectedRoute element={<Tutorial />} />} />
                    <Route path="/producthistory/:id" element={<ProductHistory />} />
                    <Route path="/manage-providers" element={<ProtectedRoute element={<ManageProviders />} />} />
                    <Route path="/barcode-scanner" element={<ProtectedRoute element={<BarcodeScanner />} />} />
                    <Route path="/pointofsale" element={<PointOfSale />} />
                    <Route path="/low-stock-alerts" element={<ProtectedRoute element={<LowStockAlerts />} />} />
                </Routes>
            </Container>
        </Router>
    );
};

export default App;
