// import express and path
const express  =  require('express');
const path = require('path');

// importing common rootDir
const rootDir = require('../util/path');

// importing controllers
const productsController = require('../controllers/products');


const router =  express.Router();

router.get('/',productsController.getProducts);



module.exports = router;