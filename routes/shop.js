const express  =  require('express');
const path = require('path');
const rootDir = require('../util/path');
const adminData = require('../routes/admin');

const router =  express.Router();

router.get('/',(req, res, next) => {
    // res.send('<h1>Hello from Express!</h1>');
    // console.log('products array ====>',adminData.products);
    // res.sendFile(path.join(rootDir,'views','shop.html'));
    const products = adminData.products;
    res.render('shop',
        {
            prods:products,
            pageTitle:"Shop",
            path:'/',
            hasProducts:products.length > 0,
            activeShop:true,
            productCSS:true
        });
});



module.exports = router;