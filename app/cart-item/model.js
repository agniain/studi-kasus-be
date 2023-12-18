const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Product name is required.'],
        minLength: [2, 'Product name must be at least 2 characters.'],
    },

    qty: {
        type: Number,
        required: [true, 'quantity is required.'],
        min: [1, 'minimum quantity is 1']
    },

    price: {
        type: Number,
        default: 0
    },

    image_url: String,

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }

});

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;