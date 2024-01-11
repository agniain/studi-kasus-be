const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

    full_name: {
        type: String,
        required: [true, 'full name is required.'],
        minLength: [2, 'full name must be at least 2 characters.'],
        maxLength: [150, 'full name can not be more than 150 characters.']
    },

    customer_id: {
        type: Number,
    },

    email: {
        type: String,
        required: [true, 'email is required.'],
        maxLength: [100, 'email can not be more than 100 characters.']
    },

    username: {
    type: String,
    required: [true, 'full name is required.'],
    },

    password: {
        type: String,
        required: [true, 'password is required.'],
        minLength: [5, 'password must be at least 5 characters.']
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    token: [String]

}, { timestamps: true });


// validasi email
userSchema.path('email').validate(function(value){
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    console.log(value);
    return EMAIL_RE.test(value);
},  attr => `${attr.value} Email is not valid!`);

// password
userSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password')) {
            const saltRounds = 10;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports = User;



