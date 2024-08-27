import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Tutorial.css';

const Tutorial = () => {
    return (
        <div className="container mt-4">
            <h3 className="text-center">Bienvenido a la Aplicación</h3>
            <h6 className="text-center mt-2">
                A continuación, te ofrecemos una guía rápida sobre cómo utilizar nuestra aplicación.
            </h6>
            <div className="mt-4 px-2">
                <h6><strong>1. Añadir Productos:</strong> Dirígete a la sección "Añadir Producto" para registrar nuevos productos en tu inventario.</h6>
                <h6><strong>2. Ver Productos:</strong> En la sección "Ver Productos" puedes consultar el inventario y gestionar los productos.</h6>
                <h6><strong>3. Editar y Eliminar:</strong> Puedes editar y eliminar productos desde la vista de productos.</h6>
                <h6><strong>4. Ayuda:</strong> Si necesitas más ayuda, consulta nuestra sección de ayuda o contacta con soporte.</h6>
            </div>
            <div className="text-center mt-4">
                <Link to="/view" className="btn btn-primary mt-2">
                    Ir a Ver Productos
                </Link>
            </div>
        </div>
    );
};

export default Tutorial;
