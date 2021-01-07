// express and router imports
const express  =  require('express');
const path = require('path');
const router =  express.Router();

// importing express-validator
const {check,body} = require('express-validator');

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
router.post('/add-product',[
    body('title')
        .isString()
        .isLength({min:3})
        .trim(),
    // body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({min:5,max:200}).trim()
        ],isAuth,adminController.postAddProduct);

// /admin/edit-product
router.get('/edit-product/:productId',isAuth,adminController.getEditProduct);

// post method = /admin/edit-product
router.post('/edit-product',[
    body('title')
        .isString()
        .isLength({min:3})
        .trim(),
    // body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({min:5,max:200}).trim()
],isAuth,adminController.postEditProduct);

// /admin/delete-product
// router.post('/delete-product',isAuth,adminController.postDeleteProduct);

router.delete('/product/:productId',isAuth,adminController.deleteProduct);




module.exports = router;
// exports.routes = router;
// exports.products = products;