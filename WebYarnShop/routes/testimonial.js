var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/testimonial', function(req, res, next) {
    res.render('testimonial');
});

module.exports = router;
