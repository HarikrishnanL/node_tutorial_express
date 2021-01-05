const Product = require('../models/product');
const {validationResult} = require('express-validator');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product',
        {
            pageTitle:"Add Product",
            path:'/admin/add-product',
            editing:false,
            hasError:false,
            errorMessage:null,
            validationErrors:[]
        }
    );
};

exports.postAddProduct = (req,res,next)=>{
    const title = req.body.title;
    // const imageUrl = req.body.imageUrl;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;

    if (!image){
        return res.status(422).render('admin/edit-product',
            {
                pageTitle:"Add Product",
                path:'/admin/add-product',
                editing:false,
                hasError:true,
                product:{
                    title:title,
                    price:price,
                    description:description
                },
                errorMessage:'Attached file is not an image.',
                validationErrors:[]
            }
        );
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).render('admin/edit-product',
            {
                pageTitle:"Add Product",
                path:'/admin/add-product',
                editing:false,
                hasError:true,
                product:{
                    title:title,
                    price:price,
                    description:description
                },
                errorMessage:errors.array()[0].msg,
                validationErrors:errors.array()
            }
        );
    }

    const imageUrl = image.path;

    const product = new Product(
        {
            title:title,
            price:price,
            description:description,
            imageUrl:imageUrl,
            userId: req.user
        });

        product
            .save()
            .then(result=>{
            console.log('product created');
            return res.redirect('/admin/products');
        })
        .catch(err =>{
            console.log('error adding product ====>',err);
            // return res.status(500).render('admin/edit-product',
            //     {
            //         pageTitle:"Add Product",
            //         path:'/admin/add-product',
            //         editing:false,
            //         hasError:true,
            //         product:{
            //             title:title,
            //             imageUrl:imageUrl,
            //             price:price,
            //             description:description
            //         },
            //         errorMessage:'Database operation failed ,please try again',
            //         validationErrors:[]
            //     }
            // );
            // res.redirect('/500');
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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
                    product:product,
                    hasError:false,
                    errorMessage:null,
                    validationErrors:[]
                }
            );
        })
        .catch(err =>{
            console.log('error while editing a product ====>',err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })

};

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).render('admin/edit-product',
            {
                pageTitle:"Edit Product",
                path:'/admin/edit-product',
                editing:true,
                hasError:true,
                product:{
                    title:updatedTitle,
                    imageUrl:updatedImageUrl,
                    price:updatedPrice,
                    description:updatedDescription,
                    _id:prodId
                },
                errorMessage:errors.array()[0].msg,
                validationErrors:errors.array()
            }
        );
    }

    Product.findById(prodId)
        .then(product=>{
          if (product.userId.toString() !== req.user._id.toString()){
            return res.redirect('/');
          }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            return  product.save()
                .then(result=>{
                console.log('updated product ======> ');
                res.redirect('/admin/products');
            })
                .catch(err=>console.log(err));
        })
        .catch(err=>{
        console.log('error while editing a product while post method=====>',err);
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
    });

};

exports.getProducts = (req,res,next)=>{
    Product.find({userId:req.user._id})
        // .select('title price -_id')
        // .populate('userId')
        // .populate('userId','name')
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
       Product
           .deleteOne({_id:prodId,userId:req.user._id})
            .then(()=>{
            console.log('product deleted');
            res.redirect('/admin/products');
            })
            .catch(err=>{
            console.log('error while deleting a product =====>',err);
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
        });

};