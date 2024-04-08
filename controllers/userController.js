require("dotenv").config()
const nodemailer = require("nodemailer")
const jwttoken = require("../utils/jwt")
const User = require("../models/userSchema")
const Product = require("../models/productSchema")
const bcrypt = require("bcryptjs");


const getHome = async (req, res) => {
  try {
    const userId = req.userid;
    const product = await Product.find({})

    if (userId) {
      const user = await User.findById(userId);
      if(user){
        res.render('user/home', { user,product });
      }else{
        res.render('user/home',{product})
      }
    } else {
      res.render('user/home',{product});
    }
  } catch (error) {
    console.log(error.message)
  }
}


const getProfile = async (req, res) => {
 try {
  id = req.userid
  const user = await User.findById(id)
  res.render('user/profile',{user})
 } catch (error) {
  console.log(error.message)
 }
}

const changePassword = async (req, res) => {

  try {
    const { password, npassword, cpassword} = req.body
    id = req.userid
    const user = await User.findById(id)
    const passtrue = await bcrypt.compare(password, user.password)
    if(passtrue){
      if( npassword === cpassword){
        const passwordHash = await securePassword(npassword)
        await User.updateOne({_id: id},{password: passwordHash})
        res.redirect('/myAccount')
      }else{
        res.render('user/profile', { err: "Password does not Match!!" })
      }
    }else{
      res.render('user/profile', { err: "Wrong Password" })
    }
  } catch (error) {
    console.log(error.message);
  }

}

const loadLogin = async (req, res) => {
  try {
    res.render('user/login')
  } catch (error) {
    console.log(error.message)
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  const logUser = await User.findOne({
    email: email,
    isAdmin: 0,
  })
  if (logUser != null) {
    const passtrue = await bcrypt.compare(password, logUser.password)
    if (passtrue) {
      const id = logUser._id.toString();
      const payload = {
        _id: id,
      };
      const token = jwttoken.createtoken(payload);
      res.cookie("token", token, { secure: true, httpOnly: true })
      res.redirect('/')
    } else {
      res.render('user/login', { err: "Invalid password" })
    }
  } else {
    res.render('user/login', { err: "User Blocked" })
  }
}



const loadRegister = async (req, res) => {
  try {
    if (!req.session.user) {
      res.render('user/register')
    } else {
      res.redirect('/')
    }
  } catch (err) {
    console.log(err.message)
  }
}



const logout = async (req, res) => {
  try {
    res.clearCookie("token")
    res.redirect('/')
  } catch (error) {
    console.log(error.message)
  }
}



const registerUser = async (req, res) => {
  try {
    console.log(req.body)
    const { fname, lname, email, mobile, password, cpassword } = req.body
    console.log(fname, lname, email, mobile, password, cpassword)
    const findUser = await User.findOne({ email });
    if (req.body.password === req.body.cpassword) {
      if (!findUser) {
        var otp = generateOtp();
        const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
          },
        })

        const info = await transporter.sendMail({
          from: process.env.NODEMAILER_EMAIL,
          to: email,
          subject: "Verify Your Account ✔",
          text: `Your OTP is ${otp}`,
          html: `<b>  <h4 >Your OTP  ${otp}</h4>    <br>  </b>`,
        })
        console.log(otp, "otp")
        if (info) {
          req.session.userOtp = otp
          setTimeout(()=>req.session.userOtp = null,60000)
          req.session.userData = req.body
          res.redirect('/verifyotp')
          console.log("Email sented", info.messageId)
        } else {
          res.json("email-error")
        }
      } else {
        console.log("User already Exist");
        res.render("signup", {
          message: "User with this email already exists",
        });
      }
    } else {
      console.log("the confirm pass is not matching")
      res.render("signup", { message: "The confirm pass is not matching" })
    }
  } catch (error) {
    console.log(error.message)
  }
}




function generateOtp() {
  const digits = "1234567890";
  var otp = "";
  for (i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)]
  }
  return otp
}




const getOtpPage = async (req, res) => {
  try {
    res.render("user/verify-otp")
  } catch (err) {
    console.log(err.message)
  }
}



const verifyOtp = async (req, res) => {
  try {

    const { otp } = req.body
    if (otp === req.session.userOtp) {
      const user = req.session.userData
      const passwordHash = await securePassword(user.password)

      const saveUserData = new User({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        mobile: user.mobile,
        password: passwordHash
      })

      await saveUserData.save()

      req.session.user = saveUserData._id
      res.redirect("/login")
    } else {
      console.log("otp not matching");
      res.render('user/verify-otp', { message: "Wrong OTP" })
    }

  } catch (error) {
    console.log(error.message)
  }
}



const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10)
    return passwordHash
  } catch (error) {
    console.log(error.message)
  }
};











module.exports = {
  getHome,
  getProfile,
  loadLogin,
  login,
  loadRegister,
  registerUser,
  getOtpPage,
  verifyOtp,
  changePassword,
  logout
}