const jwttoken = require('../utils/jwt')
const User = require("../models/userSchema");
const { decode } = require('jsonwebtoken');

const isLogged = async (req, res, next) => {

    if (req.cookies.token) {
        const decoded = await jwttoken.verifytoken(req.cookies.token)
        console.log(decoded);
        if (decoded) {
            const user = await User.findOne({ _id: decoded._id, isBlocked: false })
            console.log(user)
            if (user === null) {
                res.redirect("/login")
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

}


const notLogged = async (req, res, next) => {

    if (req.cookies.token != undefined) {
        const decoded = await jwttoken.verifytoken(req.cookies.token);
        if (decoded) {
          const user = await User.findOne({ _id: decoded._id, isBlocked: false });
          if (user === null) {
            next();
          } else {
            req.userid = decoded._id;
            next()
          }
        } else {
          console.log("error in authentication")
          next();
        }
      } else {
        next();
      }

}


const isHome = async (req, res, next) => {

    try {
        if (req.cookies.token) {
            const decoded = await jwttoken.verifytoken(req.cookies.token);
            if (decoded) {
                const user = await User.findOne({ _id: decoded._id, isBlocked: false });
                console.log(user)
                if (user === null) {
                    next()
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