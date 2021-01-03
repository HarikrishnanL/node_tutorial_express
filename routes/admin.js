// express and router imports
const express  =  require('express');
const path = require('path');
const router =  express.Router();

// root path
const rootDir = require('../util/path');

// importing controller
const adminController = require('../controllers/admin');

//importing middleware
const isAuth = require('../middleware/is-auth');



// /admin/add-product => GET
router.get('/add-product',isAuth,adminController.getAddProduct);

// /admin/products => GET
router.get('/products',isAuth,adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',isAuth,adminController.postAddProduct);

// /admin/edit-product
router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);

// post method = /admin/edit-product
router.post('/edit-product',isAuth,adminController.postEditProduct);

// /admin/delete-product
router.post('/delete-product',isAuth,adminController.postDeleteProduct);





module.exports = router;
// exports.routes = router;
// exports.products = products;