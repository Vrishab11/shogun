require("dotenv").config()
const nodemailer = require("nodemailer")
const jwttoken = require("../utils/jwt")
const User = require("../models/userSchema")
const Product = require("../models/productSchema")
const bcrypt = require("bcryptjs");


const getHome = async (req, res) => {
  try {
    const userId = req.userid;
    const product = await Product.find({isBlocked:0}).populate("category_id brand_id")
    const allowedProducts = product.filter(pro=>pro.category_id.isListed === 0)
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        res.render('user/home', { user, product:allowedProducts});
      } else {
        res.render('user/home', { product:allowedProducts})
      }
    } else {
      res.render('user/home', { product:allowedProducts});
    }
  } catch (error) {
    console.log(error.message)
  }
}

const loadLogin = async (req, res) => {
  try {
    res.render('user/login')
  } catch (error) {
    console.log(error.message)
  }
}

const getProfile = async (req, res) => {
  try {
    id = req.userid
    const user = await User.findById(id)
    res.render('user/profile', { user })
  } catch (error) {
    console.log(error.message)
  }
}

const changePassword = async (req, res) => {

  try {
    const { password, npassword, cpassword } = req.body
    id = req.userid
    const user = await User.findById(id)
    const passtrue = await bcrypt.compare(password, user.password)
    if (passtrue) {
      if (npassword === cpassword) {
        const passwordHash = await securePassword(npassword)
        await User.updateOne({ _id: id }, { password: passwordHash })
        res.redirect('/myAccount')
      } else {
        res.render('user/profile', { err: "Password does not Match!!" })
      }
    } else {
      res.render('user/profile', { err: "Wrong Password" })
    }
  } catch (error) {
    console.log(error.message);
  }

}

const loadForgotPassword = async (req, res) => {

  try {

    res.render('user/forgotPass')

  } catch (error) {
    console.log(error.message);
  }

}


const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body

    const findUser = await User.findOne({ email })

    if (findUser) {
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

      req.session.userOtp = otp

      setTimeout(() => {
        req.session.userOtp = null
        req.session.save()
        console.log('====>', req.session.userOtp);
      }, 60000)

      req.session.data = findUser
      res.render('user/resetPassOtp')

    }else{
      res.render('user/forgotPass', { err: "User not registered" })
    }

  } catch (error) {
    console.log(error.message);
  }

}

const resendOtpChangePass = async (req, res) => {
  try {

    var newOtp = generateOtp();
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
      to: req.session.data.email,
      subject: "Verify Your Account ✔",
      text: `Your newOtp is ${newOtp}`,
      html: `<b>  <h4 >Your newOtp  ${newOtp}</h4>    <br>  </b>`,
    })

    if(info){
      
      console.log(newOtp, "newOtp")
      req.session.userOtp = newOtp
      res.redirect('/verifyotp')

    }else{
      console.log("Mail error");
      res.redirect('/verifyotp')  
    }
    

  } catch (error) {
    console.log(error.message);
  }
}

const verifyChangePassOtp = async (req, res) =>{
  try {

    const {otp} = req.body

    if(otp === req.session.otp){
     
      res.render('user/changePass')
     
    }else{
      res.render('user/resetPassOtp')
    }
    
  } catch (error) {
    console.log(error.message);
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

    res.render('user/register')

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
          console.log('====>', req.session.userOtp);
          setTimeout(() => {
            req.session.userOtp = null
            req.session.save()
            console.log('====>', req.session.userOtp);
          }, 60000)

          req.session.userData = req.body

          console.log(req.session.userData);

          res.redirect('/verifyotp')
        } else {
          res.json("email-error")
        }
      } else {
        console.log("User already Exist");
        res.render("user/register", {
          message: "User with this email already exists",
        });
      }
    } else {
      console.log("the confirm pass is not matching")
      res.render("user/register", { message: "The confirm pass is not matching" })
    }
  } catch (error) {
    console.log(error.message)
  }
}




const verifyOtp = async (req, res) => {
  try {

    const { otp } = req.body
    console.log(otp);
    console.log("Session", req.session);
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


const resendOtp = async (req, res) => {
  try {

    var newOtp = generateOtp();
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
      to: req.session.userData.email,
      subject: "Verify Your Account ✔",
      text: `Your newOtp is ${newOtp}`,
      html: `<b>  <h4 >Your newOtp  ${newOtp}</h4>    <br>  </b>`,
    })

    if(info){
      
      console.log(newOtp, "newOtp")
      req.session.userOtp = newOtp
      res.redirect('/verifyotp')

    }else{
      console.log("Mail error");
      res.redirect('/verifyotp')  
    }
    

  } catch (error) {
    console.log(error.message);
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
  resendOtp,
  loadForgotPassword,
  forgotPassword,
  verifyChangePassOtp,
  resendOtpChangePass,
  changePassword,
  logout
}