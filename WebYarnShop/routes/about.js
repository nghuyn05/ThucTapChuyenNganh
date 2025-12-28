var express = require('express');
const About = require('../models/About');
const Contact = require("../models/Contact");
const Category = require("../models/Category");
var router = express.Router();

router.get('/', function(req, res, next) {
    About.find({}).then((dbAbouts) => {
        const abouts = dbAbouts.map(cat=> cat.toObject());
        res.render('admin/about/about_list', {title: 'Admin', abouts: abouts});
    });
});

/* thêm sản phẩm */
router.get('/create', function(req, res, next) {
    About.find({}).then(dbAbouts => {
        const abouts = dbAbouts.map(cat => cat.toObject());
        res.render('admin/about/create', {title: 'Create Abouts', abouts: abouts});
    });
});

router.post('/create', function(req, res, next) {
    const newAbout = new About({
        description: req.body.description,
        phone: req.body.phone,
        address: req.body.address
    });

    newAbout.save()
        .then(() => {
            res.redirect('/admin/about');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/admin/about');
        });
});


/* sửa */
router.get('/edit/:id', function(req, res, next) {
    About.findOne({_id: req.params.id}).then((about) => {
        res.render('admin/about/edit', { title: 'Edit a About' , about: about.toObject() });
    })
});
router.put('/edit/:id', function(req, res, next) {
    About.findOne({_id: req.params.id}).then(about => {
        about.description = req.body.description;
        about.phone = req.body.phone;
        about.address = req.body.address;
        about.save().then(savedAbout => {
            res.redirect('/admin/about');
        });
    });
});

/* xóa */
router.delete('/:id', function(req, res, next) {
    About.findByIdAndDelete(req.params.id)
        .then(product => {
            res.redirect('/admin/about');
        })
        .catch(next);
});


module.exports = router;
