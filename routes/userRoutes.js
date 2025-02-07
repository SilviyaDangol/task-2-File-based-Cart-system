const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/utils');
const userController = require('../controller/userController');

router.get('/', asyncHandler(userController.getAllUsers));
router.post('/', asyncHandler(userController.addUser));
router.get('/:id', asyncHandler(userController.getUserById));
router.put('/:id', asyncHandler(userController.updateUser));
router.delete('/:id', asyncHandler(userController.deleteUser));

module.exports = router;