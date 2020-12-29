const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


// routes imports
 const adminRoutes = require('./routes/admin');
 const shopRoutes = require('./routes/shop');

// importing controllers
const errorController = require('./controllers/error');

// importing database
const mongoConnect  = require('./util/database').mongoConnect;

// importing model - user
const User = require('./models/user');

const app = express();

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
   User.findById("5fea1913dfe8fbf4849de898")
       .then(user=>{
           req.user = new User(user.name,user.email, user.cart,user._id);
           next();
       })
       .catch(err=>console.log('error while finding a user====>',err));
});

app.use('/admin',adminRoutes);
 app.use(shopRoutes);

//404 error page
app.use(errorController.get404);

mongoConnect(()=>{
 app.listen(3000);
});


