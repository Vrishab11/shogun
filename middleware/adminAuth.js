const jwttoken = require('../utils/jwt')

const isLogged = async (req, res, next) => {

    try {
        if (req.cookies.admintoken) {
            const decoded = await jwttoken.verifytoken(req.cookies.admintoken)
            if (decoded) {
                req.adminid = decoded.id
                next()
            } else {
                res.redirect('/admin/login')
            }
        } else {
            res.redirect('/admin/login')
        }
    } catch (err) {
        console.log(err.message);
    }

}

const notLogged = async (req, res, next) => {
    try {
        if (req.cookies.admintoken != undefined) {
            const decoded = await jwttoken.verifytoken(req.cookies.admintoken)
            if (decoded) {
                req.adminid = decoded.id
                res.redirect("/admin/dashboard")
            } else {
                next()
            }
        } else {
            next()
        }
    } catch (err) {
        console.log(err.message);
    }
}


module.exports = {
    isLogged,
    notLogged
}