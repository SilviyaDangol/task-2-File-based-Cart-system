const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/utils');
const cartController = require('../controller/cartController');

router.get('/:userId', asyncHandler(cartController.getCart));
router.post('/:userId', asyncHandler(cartController.updateCart));
router.post('/:userId/checkout', asyncHandler(cartController.checkout));

module.exports = router;