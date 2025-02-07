
const generateUniqueId = (products) => {
    let id;
    do {
        id = Math.floor(Math.random() * 90) + 10; // Generates a number between 10 and 99
    } while (products.some(p => p.id === id)); // Ensure uniqueness
    return id;
};
module.exports = {generateUniqueId};