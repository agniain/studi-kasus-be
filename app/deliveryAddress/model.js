const mongoose = require('mongoose');

const deliveryAddressSchema = new mongoose.Schema({

    alamat: {
        type: String,
        required: [true, 'Alamat harus diisi.'],
        maxLength: [250, 'Alamat tidak boleh lebih dari 250 karakter.'],
    },

    kelurahan: {
        type: String,
        required: [true, 'Kelurahan harus diisi.'],
        maxLength: [250, 'Kelurahan tidak boleh lebih dari 250 karakter.'],
    },

    kecamatan: {
        type: String,
        required: [true, 'Kecamatan harus diisi.'],
        maxLength: [250, 'Kecamatan tidak boleh lebih dari 250 karakter.'],
    },

    kota: {
        type: String,
        required: [true, 'Kota harus diisi.'],
        maxLength: [250, 'Kota tidak boleh lebih dari 250 karakter.'],
    },

    provinsi: {
        type: String,
        required: [true, 'Provinsi harus diisi.'],
        maxLength: [250, 'Provinsi tidak boleh lebih dari 250 karakter.'],
    },
    
    detail: {
        type: String,
        required: [true, 'Detail alamat harus diisi.'],
        maxLength: [250, 'Detail alamat tidak boleh lebih dari 250 karakter.'],
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const DeliveryAddress = mongoose.model('DeliveryAddress', deliveryAddressSchema);
module.exports = DeliveryAddress;