const express = require('express');
const router = express.Router();
const Product = require('../models/ProductHistory');
const mongoose = require('mongoose');

router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product history', error });
    }
});


module.exports = router;
