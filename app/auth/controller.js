const User = require('../user/model');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { getToken } = require('../../utils');
// const bcrypt = require('bcrypt');

const register = async(req, res, next) => {
    try{
        const payload = req.body;
        console.log(payload);

        let user = new User(payload);
        await user.save();
        console.log(user);
        res.json(user);
        
    }   catch(err) {
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

const localStrategy = async (email, password, done) => {
    try{
        let user =
            await User
            .findOne({ email }) 
            .select('-__v -createdAt -updatedAt -cart_items -token');
        if(!user) return done();
        
        // without bcrypt
        if (user.password !== password) return done();
        const { password: userPassword, ...userWithoutPassword } = user.toJSON();
        return done(null, userWithoutPassword);
        
    }   catch(err) {
            done(err, null)
    }
}

// with bcrypt
 // if(bcrypt.compareSync(password, user.password)){
        //     ( {password, ...userWithoutPassword} = user.toJSON() );
        //     return done(null, userWithoutPassword);
        // }

const login = async (req, res, next) => {
    passport.authenticate('local', async function(err, user) {
        if(err) return next(err);

        if(!user) return res.json({error: 1, message: 'Email or Password incorrect'});

        let signed = jwt.sign(user, config.secretkey);

        await User.findByIdAndUpdate(user._id, {$push: {token: signed}});

        res.json({
            message: 'Login Successful',
            user,
            token: signed
        })
    })(req, res, next)
}

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
    logout,
    me
}