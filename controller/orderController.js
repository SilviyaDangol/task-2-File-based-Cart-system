const orderFileOps = require('../helpers/orderFileOps');

const getOrderHistory = async (req, res) => {
    const orders = await orderFileOps.readOrders();
    // Convert req.params.userId to integer for comparison
    const userOrders = orders.filter(o => o.userId === parseInt(req.params.userId));
    res.json(userOrders);
};
module.exports = { getOrderHistory };