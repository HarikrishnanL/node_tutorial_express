// importing models
const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
    Product.find()
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

    console.log('prodid',prodId);

    Product.findById(prodId)
        .then(product=>{
            console.log('product ====>',product)
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
    Product.find()
        .then(products=>{
            res.render('shop/index',
                {
                    prods:products,
                    pageTitle:"Shop",
                    path:'/',
                });
        })
        .catch(err=>{
            console.log('error while getting index ===>',err);
        });
};

exports.getCart = (req,res,next) =>{
  req.user
      .populate('cart.items.productId')
      .execPopulate()
      .then(user=>{
        const products = user.cart.items;
        console.log('products from user collection ====>',products);
          res.render('shop/cart',{
              path:'/cart',
              pageTitle:'Your Cart',
              products:products
          })
      })
      .catch(err=>console.log('error while fetching a cart====>',err));

};

exports.postCart = (req,res,next)=>{
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product=>{
          return   req.user.addToCart(product);

        })
        .then(result=>{
            res.redirect('/cart');
        })
        .catch(err =>console.log('error while adding a product to cart',err));
};

exports.postCartDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result =>{
            console.log('result after deleting a product from a cart-item ====>',result);
            res.redirect('/cart');
        })
        .catch(err=>console.log('error while deleting a product from a Cart ===>',err));
};

exports.postOrder = (req,res,next)=> {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user=>{
            const products = user.cart.items.map(i=>{
                return {
                    quantity:i.quantity,
                    product:{...i.productId._doc}
                }
            });
            const order = new Order({
                user:{
                    email:req.user.email,
                    userId:req.user
                },
                products: products
            });
           return  order.save();
        })
        .then(result =>{
        return   req.user.clearCart();
        })
        .then(()=>{
            res.redirect('/orders');
        })
        .catch(err=>console.log('error while ordering =====>',err));
};

exports.getOrders = (req,res,next) =>{
    Order.find({'user.userId':req.session.user._id})
        .then(orders=>{
            res.render('shop/orders',{
                path:'/orders',
                pageTitle:'Your Orders',
                orders:orders
            });
        })
        .catch(err=>console.log('error while getting a order ====>',err));

};


