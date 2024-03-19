const { application } = require("express")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const jwttoken = require("../utils/jwt")

const User = require("../models/userSchema")

const loadLogin = async (req, res) => {
  try {
    res.render("admin/login")
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
    
}

const login = async (req, res) => {
  const {email, password} = req.body
  try {
    const admin = await User.findOne({
      email: email,
      isAdmin: 1,
    })
    if(admin !== null){
      const passtrue = await bcrypt.compare(password, admin.password)
      if(passtrue){
        const id = admin._id.toString();
        const payload = {
          _id: id,
        };
        const admintoken = jwttoken.createtoken(payload);
        res.cookie("admintoken", admintoken, { secure: true, httpOnly: true });
        res.redirect('/admin/dashboard')
      }else{
        console.log("Login Error")
        res.render('admin/login',{err:"Invalid password"})
      }
    }else{
      console.log("Error login");
      res.render("admin/login",{err:"Invalid User"})
    }
  } catch (error) {
    console.error("Error in login:", error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie("admintoken").json({ success: "Logout Successful." })
  } catch (error) {
    console.log(error.message)
  }
}


const dashboard = async (req, res) => {
  res.render('admin/dashboard')
}





module.exports = {
    loadLogin,
    login,
    logout,
    dashboard
}