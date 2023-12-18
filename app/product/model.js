const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Product name is required.'],
        minLength: [2, 'Product name must be at least 2 characters.'],
    },

    description: {
        type: String,
        maxLength: [1000, 'Product description cannot exceed 1000 characters.']
    },

    price: {
        type: Number,
        default: 0
    },

    stock: {
        type: Number,
        default: 0
    },

    image_url: String,

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    tags: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;