const User = require('../user/model');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../middlewares');
const LocalStrategy = require('passport-local');

const register = async(req, res, next) => {
    try{
        let payload = req.body;
        console.log(payload);

        let counter = await User.countDocuments();
        payload = {...payload, customer_id: counter + 1}

        let user = new User(payload);
        console.log('Created user object:', user);

        await user.save();
        console.log('User saved to the database:', user);

        res.json(user);

    }   catch(err) {
        console.error('Error during registration:', err);
        if(err && err.name === 'ValidationError'){
            res.status(400).json({
            error: 1,
            message: err.message,
            fields: err.errors    
            });
        } else { 
            throw err;
        }
    } 
}

const index = async (req, res, next) => {
    try {
        const user = await User.find();
        return res.json(user);
        
    }   catch (error) {
        throw error
    }
};

const strategy = new LocalStrategy(function verify(email, password, cb) {
    db.get('SELECT * FROM users WHERE email = ?', [ email ], function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false, { message: 'Incorrect email or password.' }); }
  
      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
        if (err) { return cb(err); }
        if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
          return cb(null, false, { message: 'Incorrect username or password.' });
        }
        return cb(null, user);
      });
    });
  });

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (!user) {
            console.log('User not found');
            return res.status(401).json({
                error: 1,
                message: 'Email or Password incorrect',
            });
        }
        console.log('User authenticated successfully:', user);

        const options = { expiresIn: '7d' };
        let signed = jwt.sign({ userId: user._id, email: user.email }, config.secretkey, options);

        // Users get the new token
        await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
        console.log('Login successful. Sending response.');

        res.json({
            message: 'Login Successful',
            user,
            token: signed,
        });
    } catch (err) {
        console.error('Login error:', err);
        return next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        let token = getToken(req);

        let user = await User.findOneAndUpdate(
            { token: { $in: [token] } },
            { $pull: { token: token } },
            { useFindAndModify: false, new: true }
        );

        if (!token || !user) {
            return next({
                error: 1,
                message: 'User Not Found!'
            });
        }

        return res.json({
            error: 0,
            message: 'Logout Successful'
        });
    } catch (error) {
        next(error);
    }
};


const me = (req, res, next) => {
    if(!req.user) {
        res.json({
            err: 1,
            message: 'Login Failed or Token Expired'
        })
    }
}

module.exports = {
    register,
    strategy,
    login,
    index,
    logout,
    me
}