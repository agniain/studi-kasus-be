const { subject } = require("@casl/ability");
const { defineAbilityFor } = require("../../middlewares");
const Invoice = require("./model");

const show = async(req, res, next) => {
    try {
        let {order_id} = req.params;
        let invoice =
        await Invoice
        .findOne({order: order_id})
        .populate('order')
        .populate('user');

        let policy = defineAbilityFor(req.user);
        let subjectInvoice = subject('Invoice', {...invoice, user_id: invoice.user._id});
        if(!policy.can('read', subjectInvoice)){
            return res.json({
                error: 1,
                message: `Invoice is not allowed to be showed.`
            });
        }

        return res.json(invoice);
    } catch (err) {
        return res.json({
            error: 1,
            message: `Error when getting invoice.`
        });
    }
}

module.exports = {
    show
}