// productFileOps.js
const fs = require('fs').promises
const path = require('path');
const filePath = path.join(__dirname,'../data/products.json');
const readProducts = async () => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const parsedData = JSON.parse(data);
        return parsedData.products ? parsedData : { products: [] }; // Ensure structure
    } catch (error) {
        console.error('Error reading products file', error);
        throw new Error('Failed to read products file');
    }
};

const writeProducts = async (products) => {
    try {
        await fs.writeFile(filePath, JSON.stringify({ products }, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing products file:', error);
        throw new Error('Failed to write products file');
    }
};
const generateUniqueId = (products) => {
    let id;
    do {
        id = Math.floor(Math.random() * 90) + 10; // Generates a number between 10 and 99
    } while (products.some(p => p.id === id)); // Ensure uniqueness
    return id;
};

const addProduct = async (product) => {
    const data = await readProducts();
    const newProduct = {
        id: generateUniqueId(data.products),
        name: product.name,
        price: product.price,
        category: product.category
    };
    data.products.push(newProduct);
    await writeProducts(data.products);
    return newProduct;
};

const updateProduct = async (id, update) => {
    try {
        const data = await readProducts();
        const index = data.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');
        data.products[index] = {...data.products[index], ...update};
        await writeProducts(data.products);
        return true;
    }catch (error) {
        console.error('Error updating products file:', error);
        throw new Error('Failed to write products file');
    }
};

const deleteProduct = async (id) => {
    try{
    const data = await readProducts();


    // find product
    const productExists = data.products.some(p => p.id === id);
    // no product found
    if(!productExists)
        throw new Error('Product not found');
    const filteredProducts = data.products.filter(p => p.id !== id);
    await writeProducts(filteredProducts);
    return true;
}catch(error) {
    console.error('Error deleting products file:', error);
    throw error;}
};

const getProductById = async (id) => {
    const data = await readProducts();
    const product = data.products.find(p => p.id === parseInt(id));
    if (!product) throw new Error('Product not found');
    return product;
};
module.exports = {readProducts,writeProducts, getProductById, addProduct, updateProduct, deleteProduct};