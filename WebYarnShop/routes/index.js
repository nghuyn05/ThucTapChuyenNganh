var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
router.all('/*',
    function(
        req,
        res,
        next) {
        res.app.locals.layout = 'home';
        next();
    })


router.get('/', function (req, res, next) {

    Category.find({ status: true }).then(function (dbCategories) {

        const categories = dbCategories.map(cat => cat.toObject());

        Product.find({ status: true }).then(function (dbProducts) {

            const products = dbProducts.map(pro => pro.toObject());

            res.render('home/index', {
                title: 'Home',
                categories: categories,
                products: products
            });

        });

    });

});

//***truyền status: true ==> chỉ hiển thị những sản phẩm đang ở trạng thái active, không hiển thị những sp ở trạng thái inactive.
/* CATEGORY PAGE */
router.get('/category', function (req, res, next) {
    Category.find({ status: true }).then(function (dbCategories) {
        var categories = dbCategories.map(function (cat) {
            return cat.toObject();
        });

        res.render('home/category', {title: 'Category',categories: categories});
    });
});
router.get('/products', function(req, res, next) {
    Product.find({ status: true }).then(function (dbProducts) {
        var products = dbProducts.map(function (cat) {
            return cat.toObject();
        });

        res.render('home/products', {title: 'Products',products: products});
    });
});

router.get('/contact', function(req, res, next) {
    res.render('home/contact', { title: 'Contact' });
});
router.post('/contact/submit', function (req, res) {

    let errors = [];
    const { fullName, email, subject, message } = req.body;

    if (!fullName) errors.push({ message: 'Full name is required' });
    if (!email) errors.push({ message: 'E-mail is required' });
    if (!subject) errors.push({ message: 'Subject is required' });
    if (!message) errors.push({ message: 'Message is required' });

    if (errors.length > 0) {
        return res.render('home/contact', {
            title: 'Contact',
            errors: errors,
            fullName,
            email,
            subject,
            message
        });
    }

    const newContact = new Contact({
        fullName,
        email,
        subject,
        message
    });

    newContact
        .save()
        .then(() => {
            req.flash('success_message', 'Contact message sent successfully!');
            res.redirect('/contact');
        })
        .catch((err) => {
            console.error(err);
            res.render('home/contact', {
                error: 'An error occurred while saving the data!'
            });
        });
});
router.get('/about', function(req, res, next) {
    res.render('home/about', { title: 'About' });
});
router.get('/login', function(req, res, next) {
    res.render('home/login', { title: 'Login' });
});
//APP LOGIN
passport.use(new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
    User.findOne({email: email}).then(user => {
        if (!user)
            return done(null, false, {message: 'User not found'});

        bcrypt.compare(password, user.password, (err, matched) => {
            if (err) return err;
            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Wrong email or password'});
            }
        });

    });
}));
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);

});
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user); // Pass the user to the done callback
    } catch (err) {
        done(err); // Pass the error to the done callback if an error occurred
    }
});
router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return res.status(500).send(err); // Handle the error appropriately
        }
        res.redirect('/'); // Redirect after logout
    });

})
router.get('/register', function (req, res, next) {
    res.render('home/register', {title: 'Register'});
});
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user); // Pass the user to the done callback
    } catch (err) {
        done(err); // Pass the error to the done callback if an error occurred
    }
});

router.post('/register', (req, res, next) => {

    let errors = [];
    if (!req.body.firstName) {
        errors.push({message: 'First name is required 1'});
    }
    if (!req.body.lastName) {
        errors.push({message: 'Last name is required'});
    }
    if (!req.body.email) {
        errors.push({message: 'E-mail is required'});
    }

    if (errors.length > 0) {
        res.render('home/register', {
            title: 'Register',
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
    } else {
        User.findOne({email: req.body.email}).then((user) => {
            if (!user) {
                const newUser = new User({
                    email: req.body.email,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                });
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        newUser.password = hash;
                        newUser.save().then(saveUser => {
                            req.flash('success_message', 'Successfully registered!');
                            res.redirect('/login');//or /login
                        });
                    })
                })
            } else {
                req.flash('error_message', 'E-mail is exist!');
                res.redirect('/login');
            }
        });
    }
});

router.get('/cart', function(req, res, next) {
    res.render('home/cart', { title: 'Cart' });
});
module.exports = router;
