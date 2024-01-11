const router = require('express').Router();
const passport = require('passport');
const { police_check } = require('../../middlewares');
const cartController = require('./controller');

router.post(
    '/carts',
    passport.authenticate('bearer', { session: false }),
    police_check('create', 'CartItem'),
    cartController.store
)

router.get(
    '/carts',
    passport.authenticate('bearer', { session: false }),
    police_check('read', 'CartItem'),
    cartController.index
)

module.exports = router;