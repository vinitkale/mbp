const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/admin/categoryController');
const authController = require('./../controllers/authController');

// Protect all routes after this middleware
router.use(authController.protect);

// Only admin have permission to access for the below APIs 
router.use(authController.restrictTo('admin'));

router
    .route('/')
    .post(categoryController.createCategory)
    .get(categoryController.getAllCategories);


router
    .route('/:id')
    .get(categoryController.getCategory)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;