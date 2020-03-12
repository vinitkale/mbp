const mongoose = require('mongoose');
const validator = require('validator');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please fill your category name']
    },
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    categoryImage:{
        type:String,
        default:''
    },
    createdBy: {
        type: Object,
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});

categorySchema.pre('save', async function (next) {
    next();
});


const Category = mongoose.model('Category', categorySchema,'categories');
module.exports = Category;