const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/utils');
const orderController = require('../controller/orderController');

router.get('/:userId', asyncHandler(orderController.getOrderHistory));

module.exports = router;