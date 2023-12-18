const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Product tag is required.'],
        minLength: [2, 'Product tag must be at least 2 characters.'],
    },

});

const Tag = mongoose.model('Tag', tagSchema);
module.exports = Tag;