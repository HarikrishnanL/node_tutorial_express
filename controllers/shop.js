// importing models
const Product = require('../models/product');


exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products=>{
            res.render('shop/product-list',
                {
                    prods:products,
                    pageTitle:"All Products",
                    path:'/products'
                });
        })
        .catch(err=>{
            console.log('error while getting index ===>',err);
        });
};

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;

    // Product.findAll({where:{id:prodId}})
    //     .then(products=>{
    //         res.render('shop/product-detail',
    //             {
    //                 product:products[0],
    //                 pageTitle:products[0].title,
    //                 path:'/products'
    //             });
    //     })
    //     .catch(err=>{
    //         console.log('error while finding product by id ====>',err);
    //
    //     });

    Product.findByPk(prodId)
        .then(product=>{
            res.render('shop/product-detail',
                {
                    product:product,
                    pageTitle:product.title,
                    path:'/products'
                });
        })
        .catch(err=>{
        console.log('error while finding product by id ====>',err);

    });
};

exports.getIndex = (req,res,next)=>{
    Product.findAll()
        .then(products=>{
            res.render('shop/index',
                {
                    prods:products,
                    pageTitle:"Shop",
                    path:'/'
                });
        })
        .catch(err=>{
            console.log('error while getting index ===>',err);
        });
};

exports.getCart = (req,res,next) =>{
  req.user
      .getCart()
      .then(cart=>{
          return cart
              .getProducts()
              .then(products=>{
                         res.render('shop/cart',{
                             path:'/cart',
                             pageTitle:'Your Cart',
                             products:products
                         });
              })
              .catch(err=>console.log('error while fetching a cart',err));
      })
      .catch(err=>console.log('error while fetching a cart====>',err));

};

exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user
        .getCart()
        .then(cart=>{
            fetchedCart = cart;
            return cart.getProducts({where:{id:prodId}});
        })
        .then(products=>{
            console.log('post cart ======>',products);
            let product;
            if (products.length > 0){
                product = products[0];
            }

            if (product){
                const oldQuantity = product.cartItems.quantity
                newQuantity = oldQuantity + 1;
                return  product;
                // return  fetchedCart.addProduct(product,{through: {quantity: newQuantity}})
            }
            return Product.findByPk(prodId);
                // .then(product=>{
                //     return fetchedCart.addProduct(product,{through:{quantity: newQuantity}})
                // })
                // .catch(err=>console.log('error while fetching a product from a cart in post method =====>',err));

        })
        .then(product=>{
            return fetchedCart.addProduct(product,{through:{quantity: newQuantity}})
        })
        .then(()=>{
            res.redirect('/cart');
        })
        .catch(err=>console.log('error while adding a cart in post method =====>',err));
};

exports.postCartDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart=>{
            return cart.getProducts({where:{id:prodId}});
        })
        .then(products=>{
            console.log('products in delete method ======>',products);
            const product = products[0];
            return product.cartItems.destroy();
        })
        .then(result =>{
            console.log('result after deleting a product from a cart-item ====>',result);
            res.redirect('/cart');
        })
        .catch(err=>console.log('error while deleting a product from a Cart ===>',err));

};

exports.postOrder = (req,res,next)=> {
    let fetchedCart ;
    req.user
        .getCart()
        .then(cart=>{
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products=>{
            return req.user
                .createOrder()
                .then(order =>{
                   return order.addProducts(products.map(product => {
                        product.orderItem = {quantity: product.cartItems.quantity};
                        return product;
                    }))
                })
                .catch(err=>console.log(err));
        })
        .then(result =>{
           return   fetchedCart.setProducts(null);
        })
        .then(result =>{
            res.redirect('/orders');
        })
        .catch(err=>console.log('error while ordering =====>',err));
};

exports.getOrders = (req,res,next) =>{
    req.user
        .getOrders({include:['products']})
        .then(orders=>{
            res.render('shop/orders',{
                path:'/orders',
                pageTitle:'Your Orders',
                orders:orders
            });
        })
        .catch(err=>console.log('error while getting a order ====>',err));

};


