const { defineAbilityFor } = require("../../middlewares");
const Product = require("../product/model");
const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const Order = require("./model");
const OrderDetail = require("./orderDetailModel");


const store = async (req, res, next) => {
    try {
      const payload = req.body;
      console.log('Received Order Data:', payload);
  
      if (payload.cart_items && payload.cart_items.length > 0) {
        let items = await CartItem.find({ _id: { $in: payload.cart_items } });
  
        if (items.length > 0) {
          payload.cart_items = items.map((cartItem) => cartItem._id);
        } else {
          delete payload.cart_items;
        }
      }
  
      if (payload.delivery_address && payload.delivery_address.length > 0) {
        let address = await DeliveryAddress.find({ _id: { $in: payload.delivery_address } });
  
        if (address.length > 0) {
          payload.delivery_address = address.map((address) => address._id);
        } else {
          delete payload.delivery_address;
        }
      }
  
      // Create order details from cart items
      const orderDetails = [];
      for (const cartItemId of payload.cart_items) {
        const cartItem = await CartItem.findById(cartItemId);
        for (const product of cartItem.products) {
          const productDocument = await Product.findById(product.productId);
          orderDetails.push({
            product: productDocument._id,
            quantity: product.quantity,
            price: productDocument.price,
          });
        }
      }
  
      // Create the order with order details
      payload.order_details = await OrderDetail.create(orderDetails);
  
      // Create a new order
      let newOrder = new Order(payload);
  
      // Check user permissions
      let policy = defineAbilityFor(req.user);
      if (!policy.can('create', newOrder)) {
        return res.json({
          error: 1,
          message: `You're not allowed to modify.`,
        });
      }
  
      console.log('Order created', newOrder);
  
      // Save the order
      await newOrder.save(); 

      // clear cart
      await clearUserCart(req.user._id);
      res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        return res.json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    }
  };
  
  const clearUserCart = async (userId) => {
    try {
      // Find cart items associated with the user
      const userCartItems = await CartItem.find({ user: userId });
  
      // Delete each cart item
      for (const cartItem of userCartItems) {
        await CartItem.deleteOne({ _id: cartItem._id });
      }
  
      console.log(`User's cart cleared successfully`);
    } catch (error) {
      console.error('Error clearing user cart:', error.message);
      throw error;
    }
  };

const index = async(req, res, next) => {
    try {
        let {skip = 0, limit = 10} = req.query;
        let count = await Order.find({user: req.user._id}).countDocuments();
        let orders =
            await Order.find({user: req.user._id})
            .find({user: req.user._id})
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('cart_items')
            .sort('-createdAt');
        return res.json({
        data: orders.map(order => order.toJSON({virtuals: true})),
        count
        })
    } catch (err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

module.exports = {
    store,
    index
}