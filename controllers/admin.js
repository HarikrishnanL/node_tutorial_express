const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',
        {
            pageTitle:"Add Product",
            path:'/admin/add-product',
            editing:false
        }
    );
};

exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title,price,description,imageUrl,null,req.user._id);

        product
            .save()
            .then(result=>{
            return res.redirect('/admin/products');
        })
        .catch(err =>{
            console.log('error adding product ====>',err);
        });
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
       return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product=>{
            if (!product){
                return res.redirect('/');
            };
            res.render('admin/edit-product',
                {
                    pageTitle:"Edit Product",
                    path:'/admin/edit-product',
                    editing:editMode,
                    product:product
                }
            );
        })
        .catch(err =>{
            console.log('error while editing a product ====>',err);
        })

};

    exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const product = new Product(updatedTitle,updatedPrice,updatedDescription,updatedImageUrl,prodId);

     product
         .save()
        .then(result=>{
            console.log('updated product ======> ');
            res.redirect('/admin/products');
        })
        .catch(err=>{
        console.log('error while editing a product while post method=====>',err);
    });

};

exports.getProducts = (req,res,next)=>{

    Product.fetchAll()
        .then(products=>{
        res.render('admin/products',
            {
                prods:products,
                pageTitle:"Admin Products",
                path:'/admin/products'
            });
    })
        .catch(err =>{
            console.log('error while fetching product ====>',err);
        });
};

exports.postDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
       Product.deleteById(prodId)
        .then(()=>{
            console.log('product deleted');
            res.redirect('/admin/products');
        })
        .catch(err=>{
        console.log('error while deleting a product =====>',err);
    });

};