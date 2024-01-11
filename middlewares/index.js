const { AbilityBuilder, createMongoAbility} = require("@casl/ability");
const jwt = require('jsonwebtoken');
const config = require('../app/config');
const passport = require('passport');

function verifyAccessToken(token) {
    return async function(req, res, next) {
        try {
            const secret = config.secretkey;
            let payload = req.user
            payload = jwt.verify(token, secret);
        return { success: true, data: payload };
        } catch (error) {
        return { success: false, error: error.message };
        }
    }
}

function extractUser (req, res, next) {
  passport.authenticate('bearer', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    console.log('Authenticated user:', user);
    req.user = user; 
    next();
  })(req, res, next);
};

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!authHeader || !token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }  
    const result = verifyAccessToken(token); 
    if (!result.success) {
      return res.status(403).json({ error: result.error });
    } 
    req.user = result.data;
    next();
}

function defineAbilityFor(user) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);
    console.log('test masuk')
    // permissions for all users
    can('read', 'Product');
  
    if (user) {
      // Guest permissions
      if (user.role === 'user') {
        can('read', 'Product');
      }
  
      // User permissions
      if (user.role === 'user') {
        console.log('masuk', user.role)
        can('view', 'Order');
        can('create', 'Order');
        can('read', 'Order');
        can('update', 'User');
        can('create', 'CartItem')
        can('read', 'CartItem');
        can('update', 'CartItem');
        can('view', 'DeliveryAddress');
        can('create', 'DeliveryAddress');
        can('update', 'DeliveryAddress');
        can('delete', 'DeliveryAddress');
        can('read', 'Invoice');
      }
  
      // Admin permissions
      if (user.role === 'admin') {
        can('manage', 'all');
      }
    }
  
    return build();
    
}
  
// middleware untuk cek hak akses
function police_check(action, subject) {
    return function(req, res, next) {
        let policy = defineAbilityFor(req.user);
        if(!policy.can(action, subject)) {
            return res.json({
                error: 1,
                message: `You are not allowed to ${action} ${subject}`
            });
        }
        next();
    }
}
  


module.exports = {
    verifyAccessToken,
    extractUser,
    authenticateToken,
    defineAbilityFor,
    police_check,
}
