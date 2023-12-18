const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({

    id: Number,

    name: {
        type: String,
        required: [true, 'Category name is required.'],
        minLength: [2, 'Category name must be at least 2 characters.'],
    },

});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;