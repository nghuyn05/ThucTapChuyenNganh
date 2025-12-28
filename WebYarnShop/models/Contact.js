const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ContactSchema = new Schema({
    fullName: {
        type:String,
        required:true,
    },
    subject: {
        type:String,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
    },
    message: {
        type: String,
        required: true,
        minlength: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: Boolean,
        required: false,
    },
});
module.exports = mongoose.model('contacts', ContactSchema);