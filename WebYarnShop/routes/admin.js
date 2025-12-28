var express = require('express');
var router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');


function useAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Proceed if authenticated
    } else {
        res.redirect('/login'); // Redirect to login if authentication fails
    }
}
// Set layout admin cho tất cả routes
router.all('/*',useAuthenticated,function(
    req,
    res,
    next) {
    res.app.locals.layout = 'admin';
    next();
})
// Tìm kiếm
router.get('/products_management/search-name',function(req, res) {
    // lấy từ khóa
    const keyword = req.query.keyword;
    // truy vấn db
    Product.find({
        name: { $regex: keyword, $options: 'i' }
    })
        .populate('category_id')
        .then(products => {
            res.render('admin/products_management/products_list', {
                title: 'Products management',
                products: products.map(p => p.toObject())
            });
        });
});

// Thống kê
router.get('/', function(req, res, next) {

    // Tổng số sản phẩm
    Product.countDocuments({})
        .then(totalProducts => {

            // Tổng số danh mục
            Category.countDocuments({})
                .then(totalCategories => {

                    // Số sản phẩm đang hoạt động
                    Product.countDocuments({ status: true })
                        .then(activeProducts => {

                            // Thống kê số sản phẩm theo category
                            Category.find({})
                                .then(categories => {

                                    const promises = categories.map(cat =>
                                        Product.countDocuments({ category_id: cat._id })
                                            .then(count => ({
                                                _id: cat._id,
                                                name: cat.name,
                                                totalProducts: count
                                            }))
                                    );

                                    Promise.all(promises).then(categoryStats => {

                                        res.render('admin/index', {
                                            totalProducts,
                                            totalCategories,
                                            activeProducts,
                                            categories: categoryStats
                                        });

                                    });

                                });
                        });
                });
        });
});
module.exports = router;
