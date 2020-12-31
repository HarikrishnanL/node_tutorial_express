const User = require('../models/user');

exports.getLogin = (req,res,next) =>{
    // console.log(req.get('Cookie').split('=')[1]);
    // const isLoggedIn = req.get('Cookie').split('=')[1];
        // .split(';')[1].trim().split('=')[1]);


    res.render('auth/login',{
        path:'/login',
        pageTitle:'Login',
        isAuthenticated:false
    });

};

exports.postLogin = (req,res,next) => {
    // res.setHeader('Set-Cookie','loggedIn = true');
    // req.isLoggedIn = true;

    User.findById("5feb6cab995c040a3c09d35c")
        .then(user=>{
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err=>{
                if (!err){
                    res.redirect('/');
                } else {
                    console.log('error ====>',err);
                }

            });

        })
        .catch(err=>console.log('error while finding a user====>',err));

};

exports.postLogout = (req,res,next)=>{
    req.session.destroy((err)=>{
        console.log('error while logging out ',err);
        res.redirect('/');
    });

};
