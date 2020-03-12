//Common Controller & Constant
const CONSTANTS = require('../../constant');
const base = require('../baseController');

// Model
const Category = require('../../models/categoryModel');

// Module
const multer = require('multer');

var upload = multer({dest: CONSTANTS.ASSETS_DIR}).single('photo');

exports.deleteMe = async (req, res, next) => {
    try {
        await Category.findByIdAndUpdate(req.user.id, {
            isActive: false
        });

        res.status(204).json({
            status: 'success',
            data: null
        });


    } catch (error) {
        next(error);
    }
};

exports.getAllCategories = base.getAll(Category);
exports.getCategory = base.getOne(Category);
exports.updateCategory = base.updateOne(Category);
exports.deleteCategory = base.deleteOne(Category);

exports.createCategory = async (req, res, next) => {
    console.log(req.file);
    try {

        upload(req, res, function (err) {
            if (err) {
              // An error occurred when uploading
              console.log(err);
              return res.status(422).send("an Error occured")
            
            }
            req.body.categoryImage = req.file ? req.file.path : '';  
        });

        req.body.createdBy = req.user.id;
        const doc = await Category.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                doc
            }
        });

    } catch (error) {
        next(error);
    }
};