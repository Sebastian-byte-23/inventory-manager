// /src/services/api.js
import axios from 'axios';

// Configura la instancia de Axios
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Cambia la URL según tu configuración
    headers: {
        'Content-Type': 'application/json',
    },
});

// Función para obtener productos
export const getProducts = async (token) => {
    try {
        const response = await api.get('/products', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error getting products:', error);
        throw error;
    }
};

// Función para agregar un producto
export const addProduct = async (product, token) => {
    try {
        const response = await api.post('/products', product, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
};

// Función para eliminar productos
export const deleteProducts = async (ids, token) => {
    try {
        const response = await api.delete('/products', {
            data: { ids },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting products:', error);
        throw error;
    }
};

// Función para registrar un nuevo usuario
export const registerUser = async (user) => {
    try {
        const response = await api.post('/register', user);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

// Función para iniciar sesión
export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export default api;
