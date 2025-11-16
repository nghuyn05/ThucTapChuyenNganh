var express = require('express');
var router = express.Router();
router.all('/*',
    function(
        req,
        res,
        next) {
        res.app.locals.layout = 'home';
        next();
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/index', { title: 'Home' });
});
router.get('/products', function(req, res, next) {
    res.render('home/products', { title: 'Products' });
});
router.get('/blog_list', function(req, res, next) {
    res.render('home/blog_list', { title: 'Blog List' });
});
router.get('/contact', function(req, res, next) {
    res.render('home/contact', { title: 'Contact' });
});
router.get('/about', function(req, res, next) {
    res.render('home/about', { title: 'About' });
});
router.get('/testimonial', function(req, res, next) {
    res.render('home/testimonial', { title: 'Testimonial' });
});
router.get('/sign_up', function(req, res, next) {
    res.render('home/sign_up', { title: 'Sign up' });
});

module.exports = router;
