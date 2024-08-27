const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    action: {
        type: String,
        required: true
    },
    changeDate: {
        type: Date,
        default: Date.now
    },
    
    changes: {
        old: {
            type: mongoose.Schema.Types.Mixed, // Permite cualquier tipo de dato
            required: true
        },
        new: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        }
    }
    
});

module.exports = mongoose.model('ProductHistory', historySchema);
