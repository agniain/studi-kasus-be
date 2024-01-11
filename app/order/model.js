const mongoose = require('mongoose');
const Product = require('../product/model');
const CartItem = require('../cart-item/model');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    cart_items: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'CartItem' 
    }],

    sub_total: Number,
        
    delivery_address: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'DeliveryAddress' 
    },

    delivery_fee: {
        type: Number,
        required: true,
    },

    totalOrder: Number,

    status: {
        type: String,
        enum: ['waiting_payment', 'processing', 'in_delivery', 'delivered'],
        default: 'waiting_payment'
    },

}, { timestamps: true });

orderSchema.methods.calculateTotal = async function () {
    try {
        let subTotal = 0;

        for (const cartItemId of this.cart_items) {
            const cartItem = await CartItem.findById(cartItemId);

            // Loop through products in cartItem
            for (const product of cartItem.products) {
                const productDocument = await Product.findById(product.productId);
                // Calculate sub_total 
                subTotal += productDocument.price * product.quantity;
            }
        }

        // Calculate totalOrder
        const totalOrder = subTotal + this.delivery_fee;

        // Update
        this.sub_total = subTotal;
        this.totalOrder = totalOrder;

    } catch (error) {
        throw error;
    }
};

orderSchema.pre('save', async function (next) {
    try {
        // Call the calculateTotal method before saving
        await this.calculateTotal();
        next();
    } catch (error) {
        next(error);
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;