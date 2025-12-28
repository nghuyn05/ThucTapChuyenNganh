const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Category = require("../models/Category");

router.get('/', function(req, res, next) {
    Contact.find({}).then((dbContacts) => {
        const contacts = dbContacts.map(cat=> cat.toObject());
        res.render('admin/contact/contact_list', {title: 'Admin', contacts: contacts});
    });
});
router.get('/edit/:id', function(req, res, next) {
    Contact.findOne({_id: req.params.id}).then((contact) => {
        res.render('admin/contact/edit', { title: 'Edit a Category' , contact: contact.toObject() });
    })
});
router.put('/edit/:id', function(req, res, next) {
    Contact.findOne({ _id: req.params.id })
        .then(contact => {
            if (!contact) {
                return res.redirect('/admin/contact');
            }
            contact.status = req.body.status === 'true';
            return contact.save();
        })
        .then(() => {
            res.redirect('/admin/contact');
        })
        .catch(next);
});

router.delete('/:id', function (req, res, next) {
    Contact.deleteOne({
        _id: req.params.id,
        status: true
    })
        .then(result => {
            if (result.deletedCount === 0) {
                req.flash('error_message', 'Không thể xóa contact đang inactive!');
                return res.redirect('/admin/contact');
            }

            req.flash('success_message', 'Xóa contact thành công!');
            res.redirect('/admin/contact');
        })
        .catch(next);
});
module.exports = router;
