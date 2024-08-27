// routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Obtener todas las categorías
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva categoría
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    try {
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar una categoría
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Categoría no encontrada' });

        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();
        res.json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Ruta para eliminar una categoría
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
