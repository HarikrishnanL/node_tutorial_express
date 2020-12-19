const express  =  require('express');
const path = require('path');
const router =  express.Router();

const rootDir = require('../util/path');

const products  = [];



router.get('/add-product',(req, res, next) => {
    // res.send('<form action="/admin/add-product" method="post"><input type="text" name="title"><button type="submit">
    // Add Product</button></form>')
    // res.sendFile(path.join(rootDir,'views','add-product.html'));
    res.render('add-product',
        {
            pageTitle:"Add Product",
            path:'/admin/add-product',
            formsCSS:true,
            productCSS:true,
            activeAddProduct:true
        });
});

router.post('/add-product',(req,res,next)=>{
    products.push({title:req.body.title});
    res.redirect('/');
});



// module.exports = router;
exports.routes = router;
exports.products = products;