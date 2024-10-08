const jwttoken = require('../utils/jwt')
const User = require("../models/userSchema");
const { decode } = require('jsonwebtoken');

const isLogged = async (req, res, next) => {

    try {
        if (req.cookies.token) {
            const decoded = await jwttoken.verifytoken(req.cookies.token)
            if (decoded) {
                const user = await User.findOne({ _id: decoded._id, isBlocked: false })
                if (user === null) {
                    res.redirect('/login?msg=invalid');
                } else {
                    req.user = user
                    req.userid = decoded._id;
                    next();
                }
            } else {
                res.redirect("/login")
            }
        } else {
            res.redirect("/login")
        }
    } catch (err) {
        console.log(err.message);
    }
}


const notLogged = async (req, res, next) => {

    try {
        if (req.cookies.token != undefined) {
            const decoded = await jwttoken.verifytoken(req.cookies.token);
            if (decoded) {
                const user = await User.findOne({ _id: decoded._id, isBlocked: false });
                if (user === null) {
                    next();
                } else {
                    req.userid = decoded._id;
                    res.redirect('/')
                }
            } else {
                next();
            }
        } else {
            next();
        }
    } catch (error) {
        console.log(error.message);
    }

}


const isHome = async (req, res, next) => {

    try {
        if (req.cookies.token) {
            const decoded = await jwttoken.verifytoken(req.cookies.token);
            if (decoded) {
                const user = await User.findOne({ _id: decoded._id, isBlocked: false });
                if (user === null) {
                    next();
                } else {
                    req.user = user
                    req.userid = decoded._id;
                    next();
                }
            } else {
                next()
            }
        } else {
            next()
        }
    } catch (error) {
        console.log(error.message);
    }
    
}

module.exports = {

    isLogged,
    notLogged,
    isHome

}