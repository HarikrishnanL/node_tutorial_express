const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose  = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

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

// initializing csurf protection
const csrfProtection = csrf();

// multer storage initialization
const fileStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '-')+'-'+file.originalname);
    }
});

// multer file filter description
const fileFilter = (req,file,cb)=>{
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null,true);
    }else{
        cb(null,false);
    }

};

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret:'my string',
    resave:false,
    saveUninitialized:false,
    store:store
}));

app.use(csrfProtection);

app.use(flash());

app.use((req,res,next)=>{
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req,res,next)=>{
    if (!req.session.user){
      return next();
    }
    User.findById(req.session.user._id)
        .then(user=>{
            if (!user){
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err=>{
            console.log('error while finding a user====>',err);
            // throw new Error(err);
            next(new Error(err));
        });
});



app.use('/admin',adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

// 500 error page
app.get('/500',errorController.get500);

//404 error page
app.use(errorController.get404);



app.use((error,req,res,next)=>{
    console.log('error =====> in app ',error);
    res.redirect('/500');

    // res.status(500).render('500',{
    //     pageTitle:'Error!',
    //     path:'/500',
    //     // isAuthenticated:req.session.isLoggedIn
    // });
});

mongoose.connect(MONGODB_URI,{useUnifiedTopology: true, useNewUrlParser: true })
    .then(connection=>{
        // User.findOne()
        //     .then(user =>{
        //         if (!user){
        //             const user = new User({
        //                 name:'Hari',
        //                 email: 'hari@gmail.com',
        //                 cart: {
        //                     items:[]
        //                 }
        //             });
        //             user.save();
        //         }
        //     } )
        //     .catch(err=>console.log(err));

        console.log('database connection established ====>');
        app.listen(3000);
    })
    .catch(err=>console.log('error connecting to a mongodb database',err));

// app.listen(3000);

