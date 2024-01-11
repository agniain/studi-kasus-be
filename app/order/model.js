const mongoose = require('mongoose');
const OrderDetail = require('./orderDetailModel');

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    order_details: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'OrderDetail',
        },
    ],    

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
  
      for (const orderDetailId of this.order_details) {
        const orderDetail = await OrderDetail.findById(orderDetailId);
  
        // Calculate sub_total
        subTotal += orderDetail.price * orderDetail.quantity;
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