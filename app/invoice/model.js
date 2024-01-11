const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order', 
    }
}, { timestamps: true });


const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
