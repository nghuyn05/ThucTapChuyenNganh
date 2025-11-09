var express = require('express');
var router = express.Router();

router.all('/*',
    function(
        req,
        res,
        next) {
        res.app.locals.layout = 'home/blog_list';
        next();
    })
/* GET home page. */
router.get('/blog_list', function(req, res, next) {
    res.render('blog_list');
});

module.exports = router;
