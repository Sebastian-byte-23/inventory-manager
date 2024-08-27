import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import './register.module.css'; // Asegúrate de que el archivo CSS esté en la misma carpeta

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setSnackbarMessage('Las contraseñas no coinciden');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const newUser = { email, password };
            await axios.post('http://localhost:5000/api/register', newUser);
            setSnackbarMessage('Usuario registrado con éxito');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            setSnackbarMessage('Error al registrar usuario');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <div className="form-container">
            <h2 className="form-title">Registrar Cuenta</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="form-group">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Ingrese su correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPassword" className="form-group">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formConfirmPassword" className="form-group">
                    <Form.Label>Confirmar Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirme su contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="submit-btn">
                    Registrar
                </Button>
            </Form>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                action={
                    <Button color="inherit" onClick={handleCloseSnackbar}>
                        Cerrar
                    </Button>
                }
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Register;
