const User = require('../user/model');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');
const bcrypt = require('bcrypt');

const register = async(req, res, next) => {
    try{
        const payload = req.body;
        console.log(payload);

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

const localStrategy = async (email, password, done) => {
    console.log('Email in localStrategy:', email);
    console.log('Password in localStrategy:', password);
    try{
        let user =
            await User
            .findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } }) 
            .select('-__v -createdAt -updatedAt -cart_items -token');
        if(!user) return done();
        
        // with bcrypt
        if(bcrypt.compareSync(password, user.password)){
            ( {password, ...userWithoutPassword} = user.toJSON() );
            return done(null, userWithoutPassword);
        } else {
            console.log('Password comparison failed');
            return done();
        }
    }   catch(err) {
            done(err, null)
    }
}



const login = async (req, res, next) => {
    console.log('Entering login route');
    console.log('Email:', req.body.email, 'Password:', req.body.password );
    
        passport.authenticate('local', async function(err, user) {
            console.log('Inside passport.authenticate');

            if(err) {
                console.error('authentication error:', err);
                return next(err);
            }
    
            if (!user) {
                console.log('User not found');
                return res.json({
                    error: 1,
                    message: 'Email or Password incorrect',
                });
            }
            console.log('User authenticated successfully:', user);

            let signed = jwt.sign(user, config.secretkey);
    
            await User.findByIdAndUpdate(user._id, {$push: {token: signed}});
            console.log('Login successful. Sending response.');

            res.json({
                message: 'Login Successful',
                user,
                token: signed
            });
        })(req, res, next)
};

const logout = async (req, res, next) => {
    let token = getToken(req);

    let user = await User.findOneAndUpdate({token: {$in: [token]}}, {$pull: {token: token}}, {useFindAndModify: false});

    if(!token || !user) {
        res.json({
            error: 1,
            message: 'User Not Found!'
        });
    }

    return res.json({
        error: 0,
        message: 'Logout Successful'
    });
}

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
    localStrategy,
    login,
    index,
    logout,
    me
}