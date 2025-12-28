var express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
var router = express.Router();
function useAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Proceed if authenticated
    } else {
        res.redirect('/login'); // Redirect to login if authentication fails
    }
}
// Set layout admin cho tất cả routes
// router.all('/*', useAuthenticated,function(
//     req,
//     res,
//     next) {
//     res.app.locals.layout = 'admin';
//     next();
// })

/* GET admin home page. */
router.get('/', function(req, res, next) {
    Category.find({}).then((dbCategories) => {
        const categories = dbCategories.map(cat=> cat.toObject());
        res.render('admin/category/category_list', {title: 'Admin', categories: categories});
    });
});

router.get('/create', function(req, res, next) {
    res.render('admin/category/create', { title: 'Create Category' });
});
router.post('/create', function(req, res, next) {
    const newCategory = new Category({
        name: req.body.name,
        image: req.body.image,
        status: req.body.status,
        description: req.body.description,
    });
    newCategory.save().then(savedCategory => {
        res.redirect('/admin/category');
    });
})
router.get('/edit/:id', function(req, res, next) {
    Category.findOne({_id: req.params.id}).then((category) => {
        res.render('admin/category/edit', { title: 'Edit a Category' , category: category.toObject() });
    })
});
router.put('/edit/:id', function(req, res, next) {
    Category.findOne({_id: req.params.id}).then(category => {
        category.name = req.body.name;
        category.image = req.body.image;
        category.status = req.body.status === 'true';
        category.description = req.body.description;
        category.save().then(savedCategory => {
            res.redirect('/admin/category');
        });
    });
});

// router.delete('/:id', function(req, res, next) {
//     Category.deleteOne({_id: req.params.id}).then(category => {
//         res.redirect('/admin/category');
//     })
// })
router.delete('/:id', function (req, res) {

    const categoryId = req.params.id;

    Product.countDocuments({ category_id: categoryId })
        .then(count => {

            if (count > 0) {
                // đang có sản phẩm -> không cho xóa
                req.flash('error_message', 'Danh mục đang có sản phẩm, không được phép xóa!');
                return res.redirect('/admin/category');
            }

            // không có sản phẩm -> cho xóa
            return Category.deleteOne({ _id: categoryId })
                .then(() => {
                    req.flash('success_message', 'Xóa danh mục thành công');
                    res.redirect('/admin/category');
                });
        })
        .catch(err => {
            console.error(err);
            req.flash('error_message', 'Có lỗi xảy ra, vui lòng thử lại!');
            res.redirect('/admin/category');
        });
});

module.exports = router;
