var createError = require('http-errors');
var express = require('express');
const { engine } =require ('express-handlebars');
const hbsHelpers = require('./helpers/handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const methodOverride = require('method-override');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//app.engine
app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayouts: 'layouts',
        partialsDir: path.join(__dirname, 'views', 'partials'),
        layoutsDir: path.join(__dirname, 'views', 'layouts'),
        helpers: hbsHelpers,
    })
);

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(flash());
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
// method override
app.use(methodOverride('_method'));
// You might also need custom middleware to make flash messages available in templates
app.use((req, res, next) => {
    res.locals.user = req.user ? req.user.toObject() : null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error'); // Passport.js often uses 'error'
    res.locals.errors = req.flash('errors');
    next();
});
//load router
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');
var contactRouter = require('./routes/contact');
var aboutRouter = require('./routes/about');

console.log(path.join(__dirname, 'views', 'layouts'));
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
app.use('/products', productRouter);
app.use('/admin/category', categoryRouter);
app.use('/admin/products_management', productRouter);
app.use('/admin/contact', contactRouter);
app.use('/admin/about', aboutRouter);

//database mongoDB
const {Strategy: LocalStrategy} = require("passport-local");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const User = require('./models/User');
// const Category = require('./models/Category');
const bcrypt = require('bcrypt');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

//mongoDB
mongoose.connect('mongodb://localhost:27017/node')
    .then(() => {
        console.log("MongoDB Connected successfully.");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });
//end mongoDB

// Login cua minh
// app.post('/login', (req, res) => {
//     // const { email, password } = req.body;
//
//     User.findOne({ email: req.body.email })
//         .then(user => {
//
//             if (!user) {
//                 return res.send("User not found");
//             }
//
//             bcrypt.compare(req.body.password,user.password,(err,matched) => {
//
//                 if (err) {
//                     console.error(err);
//                     return res.send("Error during password check");
//                 }
//
//                 if (matched) {
//                     if (user.email === "stu@gmail") {
//                         return res.redirect('/admin');    // admin
//                     }
//                     //Đăng nhập thành công thì chuyển đến trang admin
//                     return res.redirect('/');
//
//                 } else {
//                     return res.send("Incorrect password");
//                 }
//             });
//         })
//         .catch(error => {
//             console.error(error);
//             res.send("Database error");
//         });
// });

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