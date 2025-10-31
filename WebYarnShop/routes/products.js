var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/products', function(req, res, next) {
    res.render('products');
});

module.exports = router;
