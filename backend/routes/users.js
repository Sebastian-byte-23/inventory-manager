const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const newUser = new User({ email, password });

    try {
        await newUser.save();
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            res.status(200).json({ message: 'Inicio de sesión exitoso' });
        } else {
            res.status(401).json({ message: 'Correo electrónico o contraseña inválidos' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
