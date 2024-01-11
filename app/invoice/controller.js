const { subject } = require("@casl/ability");
const { defineAbilityFor } = require("../../middlewares");
const Order = require("../order/model");

const show = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const invoice = 
      await Order
        .find({_id: orderId, user: req.user._id})
        .populate('order_details')

      let policy = defineAbilityFor(req.user);
      let subjectInvoice = subject('Invoice', {...invoice, user: req.user._id});
      if(!policy.can('read', subjectInvoice)){
          return res.json({
              error: 1,
              message: `Invoice is not allowed to be showed.`
          });
      }

      return res.json({
        data: invoice.map(order => order.toJSON({virtuals: true}))
        }); 
    } catch (err) {
      if (err && err.name == 'ValidationError') {
        return res.json({
          error: 1,
          message: err.message,
          fields: err.errors,
        });
      }
      next(err);
    } 
  };
  
  module.exports = {
    show,
  };
  