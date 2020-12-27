const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const expressHbs = require('express-handlebars');

// importing database
const sequelize = require('./util/database');

// importing models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

// routes imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// importing controllers
const errorController = require('./controllers/error');

const app = express();

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
   User.findByPk(1)
       .then(user=>{
           req.user = user;
           next();
       })
       .catch(err=>console.log('error while finding a user====>',err));

});

app.use('/admin',adminRoutes);
app.use(shopRoutes);

//404 error page
app.use(errorController.get404);

// establishing association

// start - product and user association
Product.belongsTo(User,{
    constraints:true,
    onDelete:'CASCADE'
});
User.hasMany(Product);
// end - product and user association

// start = user,product,cart-item and cart association
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product,{through: CartItem});
Product.belongsTo(Cart,{through: CartItem});
// end - user,product,cart-item and cart association

// start - user,product,order-item and order association

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through:OrderItem});

// end - user,product,order-item and order association

// end - establishing association




sequelize
    // .sync({force:true})
    .sync()
    .then(result=>{
       return  User.findByPk(1);
    })
    .then(user=>{
        if (!user){
           return  User.create({name:'Hari',email:'hari@gmail.com'})
        }
        return  user;
    })
    .then(user=>{
        // console.log('user info in app.js ===>',user);
        return user.createCart()
    })
    .then(cart=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log('error while creating a tables =====>',err);
    });

// app.listen(3000);
