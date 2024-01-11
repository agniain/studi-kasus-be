const { police_check } = require('../../middlewares');
const deliveryAddressController = require('./controller')
const router = require('express').Router();
const passport = require('passport');

router.get(
    '/delivery-address',
    passport.authenticate('bearer', { session: false }),
    police_check('view', 'DeliveryAddress'),
    deliveryAddressController.index
);

router.post(
    '/delivery-address', 
    passport.authenticate('bearer', { session: false }),
    police_check('create', 'DeliveryAddress'),
    deliveryAddressController.store
);

router.put(
    '/delivery-address/:id',
    passport.authenticate('bearer', { session: false }),
    deliveryAddressController.update
);

router.delete(
    '/delivery-address/:id',
    passport.authenticate('bearer', { session: false }),
    deliveryAddressController.destroy
);

module.exports = router;