// import express and path
const express  =  require('express');


// importing controllers
const shopController = require('../controllers/shop');

//importing middleware
const isAuth = require('../middleware/is-auth');


const router =  express.Router();

router.get('/',shopController.getIndex);

router.get('/products',shopController.getProducts);

router.get('/products/:productId',shopController.getProduct);

router.get('/cart',isAuth,shopController.getCart);

router.post('/cart',isAuth,shopController.postCart);

router.post('/cart-delete-item',isAuth,shopController.postCartDeleteProduct);

router.post('/create-order',isAuth,shopController.postOrder);

router.get('/orders',isAuth,shopController.getOrders);

router.get('/orders/:orderId',isAuth,shopController.getInvoice);


module.exports = router;