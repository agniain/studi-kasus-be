const mongoose = require('mongoose');

const orderDetailSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    orderID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    },

}, { timestamps: true });

const OrderDetail = mongoose.model('OrderDetail', orderDetailSchema);
module.exports = OrderDetail;