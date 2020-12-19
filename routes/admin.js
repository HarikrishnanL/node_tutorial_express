// express and router imports
const express  =  require('express');
const path = require('path');
const router =  express.Router();

// root path
const rootDir = require('../util/path');

// importing controller
const productsController = require('../controllers/products');





router.get('/add-product',productsController.getAddProduct);

router.post('/add-product',productsController.postAddProduct);



module.exports = router;
// exports.routes = router;
// exports.products = products;