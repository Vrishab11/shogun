const jwttoken = require('../utils/jwt')

const isLogged = async (req, res, next) => {

    if (req.cookies.token) {
        const decoded = await jwttoken.verifytoken(req.cookies.token)
        if (decoded) {
            const udata = await User.findOne({ _id: decoded._id, isActive: 1 });
            console.log(udata)
            if (udata === null) {
                res.redirect("/login");
            } else {
                req.userid = decoded._id;
                next();
            }
        } else {
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }

}


const notLogged = async (req, res, next) => {

    if (req.cookies.token != undefined) {
        const decoded = await jwttoken.verifytoken(req.cookies.token);
        if (decoded) {
          const udata = await User.findOne({ _id: decoded._id, isActive: 1 });
          if (udata === null) {
            next();
          } else {
            req.userid = decoded._id;
            res.redirect("/");
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
                const udata = await User.findOne({ _id: decoded._id, isActive: 1 });
                console.log(udata)
                if (udata === null) {
                    next();
                } else {
                    req.userid = decoded._id;
                    next();
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

module.exports = {

    isLogged,
    notLogged,
    isHome

}