const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSingUpStep1 = new mongoose.Schema({
    phone_number: {
        type: Number,
        required: [true, 'Please fill your password'],
        minLength: 10,
        select: false
    }, password: {
        type: String,
        required: [true, 'Please fill your password'],
        minLength: 6,
        select: false
    }, password_confirm: {
        type: String,
        required: [true, 'Please fill your password confirm'],
        validate: {
            validator: function (el) {
                // "this" works only on create and save 
                return el === this.password;
            },
            message: 'Your password and confirmation password are not the same'
        }
    }
});

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, 'Please fill your first name']
    }, last_name: {
        type: String,
        required: [true, 'Please fill your last name']
    }, email: {
        type: String,
        lowercase: true,
        validate: [validator.isEmail, ' Please provide a valid email']
    }, role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }, status: {
        type: String,
        enum: ['PendingApproval', 'Active','Blocked'],
        default: 'PendingApproval'
    }, active: {
        type: Boolean,
        default: true,
        select: false
    }
});

userSchema.path('phone_number').validate(async (value) => {
    const phoneNumberCount = await mongoose.models.User.countDocuments({phone_number: value });
    return !phoneNumberCount;
  }, 'Number already exists');

// encrypt the password using 'bcryptjs'
// Mongoose -> Document Middleware
userSchema.pre('save', async function (next) {
    // check the password if it is modified
    if (!this.isModified('password')) {
        return next();
    }
    // Hashing the password
    this.password = await bcrypt.hash(this.password, 12); 

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

// This is Instance Method that is gonna be available on all documents in a certain collection
userSchema.methods.correctPassword = async function (typedPassword, originalPassword) {
    return await bcrypt.compare(typedPassword, originalPassword);
};

const User = mongoose.model('User', userSchema,'users');
module.exports = User;