var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/products', function(req, res, next) {
    res.render('products');
});
router.get('/blog_list', function(req, res, next) {
    res.render('blog_list');
});
router.get('/contact', function(req, res, next) {
    res.render('contact');
});
router.get('/about', function(req, res, next) {
    res.render('about');
});
router.get('/testimonial', function(req, res, next) {
    res.render('testimonial');
});

module.exports = router;
