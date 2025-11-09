var createError = require('http-errors');
var express = require('express');
const { engine } = require('express-handlebars');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

app.engine(
    'hbs',
    engine({
        extname: 'hbs',
        defaultLayout: 'layouts',
        partialsDir: path.join(__dirname,'views', 'partials'),
        layoutsDir: path.join(__dirname,'views', 'layouts'),
    })
);

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');
var testimonialRouter = require('./routes/testimonial');
var productsRouter = require('./routes/products');
var blog_listRouter = require('./routes/blog_list');
var contactRouter = require('./routes/contact');
// const {engine} = require("express/lib/application");
//
// var app = express();

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
app.use('/about', aboutRouter);
app.use('/testimonial', testimonialRouter);
app.use('/products', productsRouter);
app.use('/blog_list', blog_listRouter);
app.use('/contact', contactRouter);
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
