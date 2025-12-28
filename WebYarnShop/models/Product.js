const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name: {
        type:String,
        required:true,
    },
    price: {
        type: String,
        required:true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type:String,
        required:true,
    },
    status: {
        type: Boolean,
        required: false,
    },
    description:{
        type:String,
        required: true,
    },
    // khóa ngoại
    category_id: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true,
    }
});
module.exports = mongoose.model('products', ProductSchema);