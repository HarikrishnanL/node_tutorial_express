const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose  = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);

// mongodb connection
const MONGODB_URI = 'mongodb+srv://hari_007:Hari@cluster0.xbazb.mongodb.net/shop?retryWrites=true&w=majority'


// routes imports
 const adminRoutes = require('./routes/admin');
 const shopRoutes = require('./routes/shop');
 const authRoutes = require('./routes/auth');

// importing controllers
const errorController = require('./controllers/error');

// importing model - user
 const User = require('./models/user');

const app = express();

//initializing store
const store = new mongoDBStore({
    uri:MONGODB_URI,
    collection:'sessions'
    // expire
});

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret:'my string',
    resave:false,
    saveUninitialized:false,
    store:store
}));

app.use((req,res,next)=>{
    if (!req.session.user){
      return next();
    }
    User.findById(req.session.user._id)
        .then(user=>{
            req.user = user;
            next();
        })
        .catch(err=>console.log('error while finding a user====>',err));
});


app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//404 error page
app.use(errorController.get404);

mongoose.connect(MONGODB_URI,{useUnifiedTopology: true, useNewUrlParser: true })
    .then(connection=>{
        User.findOne()
            .then(user =>{
                if (!user){
                    const user = new User({
                        name:'Hari',
                        email: 'hari@gmail.com',
                        cart: {
                            items:[]
                        }
                    });
                    user.save();
                }
            } )
            .catch(err=>console.log(err));

        console.log('database connection established ====>');
        app.listen(3000);
    })
    .catch(err=>console.log('error connecting to a mongodb database',err));

// app.listen(3000);

