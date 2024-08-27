import React from 'react';
import ReactDOM from 'react-dom/client'; // Cambia la importación
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';


// Crea una raíz para tu aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderiza la aplicación usando la nueva raíz
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
