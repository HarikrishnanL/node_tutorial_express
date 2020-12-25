const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const expressHbs = require('express-handlebars');

// importing database
const sequelize = require('./util/database');

// routes imports
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// importing controllers
const errorController = require('./controllers/error');

const app = express();

// app.engine('handlebars',expressHbs({ defaultLayout: 'main-layout',layoutsDir:'views/layouts/' }));
// app.set('view engine','pug');
// app.set('view engine','handlebars');
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

//404 error page

app.use(errorController.get404);

sequelize.sync()
    .then(result=>{
        // console.log('result after synying with database ======>',result);
        app.listen(3000);

    })
    .catch(err=>{
        console.log('error while creating a tables =====>',err);
    });

// app.listen(3000);
