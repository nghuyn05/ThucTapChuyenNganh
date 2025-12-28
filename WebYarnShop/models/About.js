const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AboutSchema = new Schema({
    description: {
        type:String,
        required:true,
    },
    address: {
        type:String,
        required:true,
    },
    phone: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('abouts', AboutSchema);