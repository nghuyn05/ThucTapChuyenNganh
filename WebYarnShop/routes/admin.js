var express = require('express');
var router = express.Router();
function useAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Proceed if authenticated
    } else {
        res.redirect('/login'); // Redirect to login if authentication fails
    }
}
// Set layout admin cho tất cả routes
router.all('/*', useAuthenticated,function(
    req,
    res,
    next) {
    res.app.locals.layout = 'admin';
    next();
})

/* GET admin home page. */
router.get('/', function(req, res, next) {
    res.render('admin/index', { title: 'Admin' });
});

/* GET category management page. */
router.get('/category', function(req, res, next) {
    res.render('admin/category/category_list', { title: 'Category' });
});

router.get('/customer_management', function(req, res, next) {
    res.render('admin/customer_management/customer_list', { title: 'Customer management' });
});
router.get('/order_management', function(req, res, next) {
    res.render('admin/order_management/order_list', { title: 'Order management' });
});
router.get('/products_management', function(req, res, next) {
    res.render('admin/products_management/products_list', { title: 'Products management' });
});
router.get('/test', function(req, res, next) {
    res.render('admin/test/test_list', { title: 'Products management' });
});
router.get('/login', function(req, res, next) {
    res.render('admin/login', { title: 'Login' });
});
module.exports = router;
