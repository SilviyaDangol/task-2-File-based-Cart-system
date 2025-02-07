const fs = require('fs').promises;
const productFileOps = require('../helpers/productFileOps');

const getAllProducts = async (req, res) => {
    const data = await productFileOps.readProducts();
    res.json(data);
};

// Add new product
const addProduct = async (req, res) => {
    if (!req.body.name || !req.body.price) {
        throw new Error('Product name and price are required');
    }
    const productData = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
        // add other fields as needed
    };
    const newProduct = await productFileOps.addProduct(productData);
    res.status(201).json({
        message: 'Product added successfully',
        product: newProduct
    });
};

// Update product
const updateProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        throw new Error('Product ID is required');
    }
    await productFileOps.updateProduct(id, req.body);
    res.json({
        message: 'Product updated successfully',
        product: req.body
    });
};

// Delete product
const deleteProduct = async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }
    try {
        await productFileOps.deleteProduct(id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        if (error.message === 'Product not found') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to delete product' });
        }
    }
};



const getProductById = async (req, res) => {
    const id = req.params.id;
    const product = await productFileOps.getProductById(id);
    res.json(product);
};

module.exports = {
    getAllProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById
};