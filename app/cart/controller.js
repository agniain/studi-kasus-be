const { defineAbilityFor } = require("../../middlewares");
const CartItem = require("../cart-item/model");
const Product = require("../product/model");

const store = async (req, res, next) => {
    try {
        let payload = req.body;
        let user = req.user;
        console.log(payload);

        if (payload.products && payload.products.length > 0) {
            const productIds = payload.products.map(product => product.productId);
            let productInCart = await Product.find({ _id: { $in: productIds } });

            if (productInCart.length > 0) {
                payload.products = productInCart.map(product => ({
                    productId: product._id,
                    quantity: payload.products.find(p => p.productId.toString() === product._id.toString()).quantity
                }));
            } else {
                delete payload.products;
            }
        }

        const existingCart = await CartItem.findOne({ user: req.user._id });

        if (existingCart) {
            // Cart exists, update it
            let policy = defineAbilityFor(req.user);
            if (!policy.can('update', existingCart)) {
                return res.json({
                    error: 1,
                    message: `You're not allowed to update the cart!`
                });
            }

            // Update
            if (payload.products && payload.products.length > 0) {
                payload.products.forEach(newProduct => {
                    const existingProductIndex = existingCart.products.findIndex(
                        p => p.productId.toString() === newProduct.productId.toString()
                    );
            
                    if (existingProductIndex !== -1) {
                        // Product already exists, update
                        existingCart.products[existingProductIndex].quantity = newProduct.quantity;
                    } else {
                        // Product not exist, add it to the cart
                        existingCart.products.push(newProduct);
                    }
                });
            }
            
            // Remove products with quantity 0
            existingCart.products = existingCart.products.filter(product => product.quantity > 0);

            await existingCart.save();

            return res.json({ message: 'Cart updated successfully', cart: existingCart });
        } else {
            // Cart doesn't exist, create it
            let createCart = new CartItem({ ...payload, user: user._id });

            let policy = defineAbilityFor(req.user);
            if (!policy.can('create', createCart)) {
                return res.json({
                    error: 1,
                    message: `You're not allowed to create a cart!`
                });
            }
            await createCart.save();
            return res.json({ message: 'Cart created successfully', cart: createCart });
        }
    } catch (error) {
        next(error);
    }
};

const index = async(req, res, next) => {
    try {
        let items = 
        await CartItem
        .find({user: req.user._id})
        .populate('products');

        return res.json(items);

    }   catch (err) {
        if(err && err.name == 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }
        next(err)
    }
}

module.exports = {
    store,
    index,
}