var express = require('express');
var router = express.Router();
router.all('/*',
    function(
        req,
        res,
        next) {
        res.app.locals.layout = 'home/about';
        next();
    })
/* GET home page. */
router.get('/about', function(req, res, next) {
    res.render('about');
});

module.exports = router;
