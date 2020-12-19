const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const expressHbs = require('express-handlebars');

// routes imports

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// app.engine('handlebars',expressHbs({ defaultLayout: 'main-layout',layoutsDir:'views/layouts/' }));
// app.set('view engine','pug');
// app.set('view engine','handlebars');
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminData.routes);
app.use(shopRoutes);

//404 error page

app.use((req,res,next)=>{
    // res.status(404).send('<h1>page not found</h1>')
    // res.status(404).sendFile(path.join(__dirname,'views','404.html'));
    res.status(404).render('404',{pageTitle:'Page Not Found'});
});

app.listen(3000);
