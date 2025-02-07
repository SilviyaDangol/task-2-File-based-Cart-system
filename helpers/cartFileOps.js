const fs = require('fs').promises;
const path = require('path');


const cartsPath = path.join(__dirname, '../data/carts.json');


const readCarts = async () => {
    try {
        const data = await fs.readFile(cartsPath, 'utf8');
        return JSON.parse(data).carts;
    } catch (err) {
        return [];
    }
};


const writeCarts = async (carts) => {
    await fs.writeFile(cartsPath, JSON.stringify({ carts }, null, 2));
};

const getOrCreateCart = async (userId) => {
    const carts = await readCarts();
    let cart = carts.find(c => c.userId === userId);

    if (!cart) {
        cart = { userId:parseInt(userId), items: [] };
        carts.push(cart);
        await writeCarts(carts);
    }

    return cart;
};

const updateCart = async (userId, productId, quantity) => {
    const carts = await readCarts();
    // Remove any other carts for this user
    const otherCarts = carts.filter(c => c.userId !== userId);

    // Get or create user's cart
    let cart = carts.find(c => c.userId === userId);
    if (!cart) {
        cart = { userId: parseInt(userId), items: [] };
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

    // Save the updated cart along with other users' carts
    otherCarts.push(cart);
    await writeCarts(otherCarts);
    return cart;
};

const clearCart = async(userId) => {
    try {
        const carts = await readCarts();
        // Keep all carts EXCEPT the one matching userId
        const updatedCarts = carts.filter(c => c.userId !== userId);
        await writeCarts(updatedCarts);
    } catch(err) {
        console.error(err);
        throw err;
    }
}
module.exports = { getOrCreateCart, updateCart, readCarts,clearCart };