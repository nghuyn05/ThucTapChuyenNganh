var express = require('express');
var router = express.Router();
router.all('/*',
    function(
        req,
        res,
        next) {
        res.app.locals.layout = 'home/products';
        next();
    })

/* GET home page. */
router.get('/products', function(req, res, next) {
    res.render('products');
});

module.exports = router;
