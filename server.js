const express = require('express');
const bodyParser = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');

const productRoutes = require('./routes/productRoute.js');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


const { errorHandler } = require('./utils/utils');


app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public')); // Serve static files from 'public' directory

app.use('/products', productRoutes)
app.use('/users', userRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);


//error handling utils that runs last
app.use(errorHandler);// custom errorHandler but doesn't define any specific errors yet
app.listen(port,()=>console.log (`Server is listening on port ${port}`));
