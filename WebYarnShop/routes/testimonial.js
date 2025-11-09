var express = require('express');
var router = express.Router();
router.all('/*',
    function(
        req,
        res,
        next) {
        res.app.locals.layout = 'home/testimonial';
        next();
    })

/* GET home page. */
router.get('/testimonial', function(req, res, next) {
    res.render('testimonial');
});

module.exports = router;
