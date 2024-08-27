import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            if (response.status === 200) {
                login();
                navigate('/tutorial');
            }
        } catch (error) {
            setAlertMessage('Correo electrónico o contraseña inválidos');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles['login-container']}>
                <div className={styles['login-form-container']}>
                    <h2 className="text-center mb-4">Iniciar Sesión</h2>
                    <p className="text-center mb-4">Por favor, ingresa tu correo electrónico y contraseña</p>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Correo Electrónico</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                        {showAlert && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {alertMessage}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
