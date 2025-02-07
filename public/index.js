import {response} from "express";

import axios from "axios";

let products = [];
let categories = new Set();


async function fetchProducts() {
    try{
        // fetching the json list of products
       const response =await axios.get("http://localhost:3000/products/",{
            // method: "GET",
            // headers: {},
            // body: JSON.stringify({})
        })
           .catch(error => {
               console.error("Failed to fetch product.json:", error);
           });
        products = response.data; // file is read
        //loops through all products in the json file and
        // //Extract unique categories
        products.forEach(product => {
            if(product.category){ // if category property exists in product
                // if not nothing happens
                categories.add(product.category);
            }
        })
        // dynamically populate the category filter with new all categories
        const categoryFilter = document.getElementById("category-filter");
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categoryFilter.appendChild(option)
        });

        // Initial render
        renderProdcuts(products);
    }
    catch(error){
        console.error("Error loading products:", error);
        const productGrid = document.getElementById("product-grid");
        productGrid.innerHTML = `
        <div class = "error">
        Error loading products. Please make sure products.json exists and is properly formatted.
        <br>
        Error: ${error.message}
        <div>
`;}
}
// function to render products
function renderProducts(filteredProducts){
    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = ``;

    if (filteredProducts.length === 0){
        productGrid.innerHTML = `<div class = "error"> No products
found matching your criteria</div>`
        return null;
    }
    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = 'product-card';
        productCard.innerHTML =  `
                    <div class="product-image">${product.image ? `<img src="${product.image}" alt="${product.name}">` : 'No Image'}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-category">${product.category || 'Uncategorized'}</div>
                    <div class="product-price">₹${product.price}</div>
                `;
        productGrid.appendChild(productCard);
    });
}

fetchProducts();

// Search functionality
document.getElementById('search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    renderProducts(filteredProducts);
});

// Category filter
document.getElementById('category-filter').addEventListener('change', (e) => {
    const categoryFilter = e.target.value;
    const searchTerm = document.getElementById('search').value.toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    renderProducts(filteredProducts);
});
