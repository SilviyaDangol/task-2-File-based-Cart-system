const fs = require('fs').promises;
const path = require('path');
const productFileOps = require('./productFileOps');

const ordersPath = path.join(__dirname, '../data/orders.json');
const writeOrders = async (orders) => {
    await fs.writeFile(ordersPath, JSON.stringify({ orders }, null, 2));
};
const createOrder = async (userId, items, total) => {
    const orders = await readOrders();
    const newOrder = {
        orderId: Date.now().toString(),
        userId,
        items,
        total,
        status:'created',
        timestamp: new Date().toISOString()
    };
    orders.push(newOrder);
    await writeOrders(orders);
    return newOrder;
};

const readOrders = async () => {
    try {
    const data = await fs.readFile(ordersPath, 'utf8');
    return JSON.parse(data).orders;
}catch(error) {
    return [];
}
};


module.exports = { createOrder, readOrders,writeOrders };