// productRoute.js
const express = require('express');
const router = express.Router();
const { asyncHandler } = require("../utils/utils");
const productController = require('../controller/productController');

router.get('/', asyncHandler(productController.getAllProducts));
router.post('/', asyncHandler(productController.addProduct));
router.get('/:id', asyncHandler(productController.getProductById));
router.put('/:id', asyncHandler(productController.updateProduct));
router.delete('/:id', asyncHandler(productController.deleteProduct));

module.exports = router;