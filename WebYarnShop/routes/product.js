var express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
var router = express.Router();

function useAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

/* GET admin products list */
router.get('/', async function(req, res, next) {
    const page = parseInt(req.query.page) || 1;
    const limit = 5; // số sản phẩm / trang
    const skip = (page - 1) * limit;

    try {
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limit);

        const dbproducts = await Product.find({})
            .populate('category_id')
            .skip(skip)
            .limit(limit)
            .sort({ _id: -1 });

        res.render('admin/products_management/products_list', {
            title: 'Management Products',
            products: dbproducts.map(p => p.toObject()),
            currentPage: page,
            totalPages,
            hasPrev: page > 1,
            hasNext: page < totalPages,
            prevPage: page - 1,
            nextPage: page + 1
        });

    } catch (err) {
        next(err);
    }
});


/* thêm sản phẩm */
router.get('/create', function(req, res, next) {
    Category.find({}).then(dbCategories => {
        const categories = dbCategories.map(cat => cat.toObject());
        res.render('admin/products_management/create', {title: 'Create Products', categories: categories});
    });
});

router.post('/create', function(req, res, next) {
    const newProduct = new Product({
        name: req.body.name,
        price: req.body.price,
        quantity: Number(req.body.quantity),
        image: req.body.image,
        category_id: req.body.category_id,
        status: req.body.status === 'true',
        description: req.body.description
    });

    newProduct.save()
        .then(() => {
            res.redirect('/admin/products_management');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/products_management');
        });
});


/* sửa sản phẩm */
router.get('/edit/:id', function(req, res) {
    Product.findOne({ _id: req.params.id }).then(product => {
        Category.find({}).then(categories => {

            const newCategories = categories.map(cat => {
                const catObj = cat.toObject();
                catObj.selected =
                    cat._id.toString() === product.category_id.toString();
                return catObj;
            });

            res.render('admin/products_management/edit', {
                product: product.toObject(),
                categories: newCategories
            });
        });
    });
});

router.put('/edit/:id', function(req, res, next) {
    Product.findOne({ _id: req.params.id })
        .then(product => {
            product.name = req.body.name;
            product.price = req.body.price;
            product.quantity = Number(req.body.quantity);
            product.image = req.body.image;
            product.category_id = req.body.category_id;
            product.status = req.body.status === 'true';
            product.description = req.body.description;

            return product.save();
        })
        .then(() => {
            res.redirect('/admin/products_management');
        })
        .catch(next);
});


/* xóa sản phẩm */
router.delete('/:id', function(req, res, next) {
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            res.redirect('/admin/products_management');
        })
        .catch(next);
});

/* lấy sản phẩm theo category */
router.get('/category/:id', function(req, res, next) {
    Category.findOne({ _id: req.params.id }).then(category => {
        if (!category) {
            return res.redirect('/');
        }
        // lấy tất cả sản phẩm thuộc category
        Product.find({ category_id: req.params.id }).then(dbProducts => {
            const products = dbProducts.map(p => p.toObject());

            res.render('home/detail_category', {
                title: category.name,
                category: category.toObject(),
                products: products // đổ dữ liệu từ db lên view
            });
        });
    });
});

/* Lọc trạng thái*/
router.get('/filter-status', function(req, res) {
    let condition = {};

    if (req.query.status === 'active') {
        condition.status = true;
    }

    if (req.query.status === 'inactive') {
        condition.status = false;
    }

    Product.find(condition) // lấy ds sp theo đk
        .populate('category_id') // lấy thông tin danh mục
        .then(products => {
            res.render('admin/products_management/products_list', {
                title: 'Products management',
                products: products.map(p => p.toObject())
            });
        });
});

/* Lọc theo category */
router.get('/filter-category', function(req, res) {
    const categoryId = req.query.categoryId;

    Product.find({ category_id: categoryId })
        .populate('category_id')
        .then(products => {
            res.render('admin/products_management/products_list', {
                title: 'Products management',
                products: products.map(p => p.toObject())
            });
        });
});

/* Chi tiết sản phẩm */
router.get('/:id', function(req, res) {
    Product.findById(req.params.id)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }

            res.render('home/detail_product', {
                title: product.name,
                product: product.toObject()
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('/');
        });
});

module.exports = router;
