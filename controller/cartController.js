const cartFileOps = require('../helpers/cartFileOps');
const productFileOps = require('../helpers/productFileOps');
const orderFileOps = require("../helpers/orderFileOps");


// get cart with product details
const getCart = async (req, res) => {
    try {
        const cart = await cartFileOps.getOrCreateCart(parseInt(req.params.userId));

        // Add product details to cart items
        const itemsWithDetails = await Promise.all(
            cart.items.map(async (item) => {
                const product = await productFileOps.getProductById(item.productId);
                return {
                    ...item,
                    name: product.name,
                    price: product.price,
                    total: product.price * item.quantity
                };
            })
        );

        res.json({ ...cart, items: itemsWithDetails });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
// const updateCart = async (userId, productId, quantity) => {
//     userId = parseInt(userId);
//     productId = parseInt(productId);
//     quantity = parseInt(quantity);
//
//     const carts = await readCarts();
//     let cart = carts.find(c => c.userId === userId);
//
//     if (!cart) {
//         // Create new cart if doesn't exist
//         cart = { userId, items: [] };
//         carts.push(cart);
//     } else {
//         // Remove this cart from array to update it
//         const cartIndex = carts.findIndex(c => c.userId === userId);
//         carts.splice(cartIndex, 1);
//     }
//
//     const itemIndex = cart.items.findIndex(i => i.productId === productId);
//
//     if (itemIndex > -1) {
//         if (quantity > 0) {
//             cart.items[itemIndex].quantity = quantity;
//         } else {
//             cart.items.splice(itemIndex, 1);
//         }
//     } else if (quantity > 0) {
//         cart.items.push({ productId, quantity });
//     }
//
//     // Add updated cart back
//     carts.push(cart);
//     await writeCarts(carts);
//     return cart;
// };


const updateCart = async (userId, productId, quantity) => {
    userId = parseInt(userId);
    productId = parseInt(productId);
    quantity = parseInt(quantity);

    const carts = await readCarts();
    let cart = carts.find(c => c.userId === userId);

    if (!cart) {
        // Create new cart if doesn't exist
        cart = { userId, items: [] };
        carts.push(cart);
    } else {
        // Remove this cart from array to update it
        const cartIndex = carts.findIndex(c => c.userId === userId);
        carts.splice(cartIndex, 1);
    }

    const itemIndex = cart.items.findIndex(i => i.productId === productId);

    if (itemIndex > -1) {
        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }
    } else if (quantity > 0) {
        cart.items.push({ productId, quantity });
    }

    // Add updated cart back
    carts.push(cart);
    await writeCarts(carts);
    return cart;
};
const checkout = async (req, res) => {
    try{
        const userId = parseInt(req.params.userId);
        const carts = await cartFileOps.readCarts();
        const cart = carts.find(c => c.userId === userId);

        if (!cart || !cart.items.length) {
            throw new Error('Cart is empty');
        }

        let total = 0;
        const itemsWithDetails = await Promise.all(
            cart.items.map(async (item) => {
                const product = await productFileOps.getProductById(item.productId);
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                return {
                    productId: item.productId,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    total: itemTotal
                };
            })
        );

        if (total < 100) {
            throw new Error('Minimum order amount is $100');
        }

        // Create and save order
        const order = await orderFileOps.createOrder(userId, itemsWithDetails, total);

        // Clear cart after successful order creation
        await cartFileOps.clearCart(userId);

        res.json({
            message: 'Order created successfully',
            order
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};
module.exports = { getCart, updateCart, checkout };