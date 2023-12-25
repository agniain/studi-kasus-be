const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Product name is required.'],
    },

    qty: {
        type: Number,
        required: [true, 'quantity is required.'],
        min: [1, 'minimum quantity is 1']
    },

    price: {
        type: Number,
        required: [true, 'Product price is required.']
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },

    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;