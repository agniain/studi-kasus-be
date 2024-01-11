const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    
    products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
          quantity: {
            type: Number,
            require: true
          }
        }
    ]

}, { timestamps: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);
module.exports = CartItem;