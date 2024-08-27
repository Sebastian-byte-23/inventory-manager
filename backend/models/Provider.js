const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Provider', providerSchema);
