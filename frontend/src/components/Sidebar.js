import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // Importa el archivo CSS

const Sidebar = ({ open, onClose, onLogout }) => {
    const handleLogout = () => {
        onLogout(); // Llama a la función de cierre de sesión
        onClose(); // Cierra el menú lateral
    };

    return (
        <div className={`sidebar ${open ? 'open' : ''}`}>
            <div className="sidebar-header">
                <h2 className="sidebar-title">Menú</h2>
                <button className="btn-close" onClick={onClose}>×</button>
            </div>
            <ul className="sidebar-list">
                <li>
                    <NavLink
                        to="/add"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Añadir Producto
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/view"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Ver Productos
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/view-categories"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Ver por Categoría
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/manage-providers"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Gestión de Proveedores
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/barcode-scanner"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Buscar Producto
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/low-stock-alerts"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Alertas de Stock Bajo
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/product-history"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Historial de cambios
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/pointofsale"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Punto de venta
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/tutorial"
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={onClose}
                    >
                        Tutorial
                    </NavLink>
                </li>
            </ul>
            <div className="sidebar-footer">
                <button className="btn-logout" onClick={handleLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
