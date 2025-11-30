var createError = require('http-errors');
var express = require('express');
const { engine } =require ('express-handlebars');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayouts: 'layouts',
        partialsDir: path.join(__dirname, 'views', 'partials'),
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
    })
);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const bcrypt = require('bcrypt');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/node')
    .then(() => {
        console.log("MongoDB Connected successfully.");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    })
//Login
// app.post('/login', (req, res) => {
//     User.findOne({email: req.body.email}).then((user) => {
//         if (user) {
//             bcrypt.compare(req.body.password,user.password,(err,matched)=>{
//                 if(err) return err;
//                 if(matched){
//                     res.send("User was logged in");
//                 }else {
//                     res.send("User was not logged in");
//                 }
//             })
//         }
//     })
// });

app.post('/login', (req, res) => {
    // const { email, password } = req.body;

    User.findOne({ email: req.body.email })
        .then(user => {

            if (!user) {
                return res.send("User not found");
            }

            bcrypt.compare(req.body.password,user.password,(err,matched) => {

                if (err) {
                    console.error(err);
                    return res.send("Error during password check");
                }

                if (matched) {
                    if (user.email === "stu@gmail") {
                        return res.redirect('/admin');    // admin
                    }
                    return res.redirect('/');

                } else {
                    // return res.send("Incorrect password");
                    return res.redirect('/admin');
                }
            });
        })
        .catch(error => {
            console.error(error);
            res.send("Database error");
        });
});



//Register
app.post('/register',
    (
        req,
        res) => {
        const newUser = new User();
        newUser.email = req.body.email;
        newUser.password = req.body.password;
        bcrypt.genSalt(10,
            function (err, salt) {
                bcrypt.hash(newUser.password, salt,
                    function (err, hash) {
                        if (err) {return  err}
                        newUser.password = hash;

                        newUser.save().then(userSave=>
                        {
                            return res.redirect('/');
                        }).catch(err => {
                            res.send('USER ERROR'+err);
                        });
                    });
            });
    }
);
// Logout
app.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.log(err);
                return res.send('Có lỗi xảy ra khi logout');
            }
            res.redirect('/'); // Logout xong quay về index
        });
    } else {
        // Nếu không dùng session thì chỉ redirect
        res.redirect('/');
    }
});
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
const {Router} = require("express");




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;