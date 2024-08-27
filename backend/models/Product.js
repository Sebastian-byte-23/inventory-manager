// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    dateAdded: { type: Date, default: Date.now },
    barcode: { type: String, required: true, unique: true }, // Agregado para el código de barras
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    lowStockThreshold: { type: Number, default: 10 }, 
});


module.exports = mongoose.model('Product', ProductSchema);
