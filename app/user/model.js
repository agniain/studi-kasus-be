const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);
// const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    full_name: {
        type: String,
        required: [true, 'full name is required.'],
        minLength: [2, 'full name must be at least 2 characters.'],
        maxLength: [250, 'full name can not be more than 250 characters.']
    },

    customer_id: {
        type: Number,
    },

    email: {
        type: String,
        required: [true, 'email is required.'],
        maxLength: [250, 'email can not be more than 250 characters.']
    },

    password: {
        type: String,
        required: [true, 'password is required.'],
        maxLength: [250, 'password can not be more than 250 characters.']
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
    return EMAIL_RE.text(value);
},  attr => `${attr.value} Email is not valid!`);

userSchema.path('email').validate(async function(value){
    try {
        const count = await this.model('User').count({email: value});

        return !count;
    }   catch(err) {
        throw err
    }
}, attr => `${attr.value} Email is registered.`);

// const HASH_ROUND = 10;
// userSchema.pre('save', function(next){
//     this.password = bcrypt.hashSync(this.password, HASH_ROUND);
//     next()
// });

userSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});

const User = mongoose.model('User', userSchema);
module.exports = User;