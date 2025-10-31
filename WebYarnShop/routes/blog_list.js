var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/blog_list', function(req, res, next) {
    res.render('blog_list');
});

module.exports = router;
