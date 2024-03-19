const jwttoken = require('../utils/jwt')

const isLogged = async (req, res, next) => {

    if(req.cookies.admintoken){
        const decoded = await jwttoken.verifytoken(req.cookies.admintoken)
        if(decoded)
        {
            req.adminid = decoded.id
            next()
        }else{
            res.redirect('/admin/login')
        }
    }else{
        res.redirect('/admin/login')
    }

}

const notLogged = async (req, res, next) => {
    if(req.cookies.admintoken != undefined)
    {   
        const decoded =await jwttoken.verifytoken(req.cookies.admintoken)
        console.log(decoded)
        if(decoded)
        {
            req.adminid = decoded.id
            res.redirect("/admin/dashboard")
        }else{
            res.redirect('/admin/login')
            next()
        }
    }else{
        next()
    }
}


module.exports = {
    isLogged,
    notLogged
}