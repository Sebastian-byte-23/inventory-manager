const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

// Crear un proveedor
router.post('/', async (req, res) => {
    try {
        const provider = new Provider(req.body);
        await provider.save();
        res.status(201).send(provider);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Obtener todos los proveedores
router.get('/', async (req, res) => {
    try {
        const providers = await Provider.find();
        res.json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar un proveedor
router.put('/:id', async (req, res) => {
    try {
        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!provider) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json(provider);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un proveedor
router.delete('/:id', async (req, res) => {
    try {
        const provider = await Provider.findByIdAndDelete(req.params.id);
        if (!provider) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        res.json({ message: 'Proveedor eliminado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
