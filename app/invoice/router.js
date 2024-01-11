const router = require('express').Router();
const passport = require('passport');
const invoiceController = require('./controller');
const { police_check } = require('../../middlewares');

router.get('/invoices/:orderId', 
    passport.authenticate('bearer', { session: false }),
    police_check('read', 'Invoice'),
    invoiceController.show);

module.exports = router;