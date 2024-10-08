require("dotenv").config()
const nodemailer = require("nodemailer")
const jwttoken = require("../utils/jwt")
const jwt = require("jsonwebtoken")
const User = require("../models/userSchema")
const Product = require("../models/productSchema")
const bcrypt = require("bcryptjs")


const getHome = async (req, res) => {
  try {
    const userId = req.userid;
    const product = await Product.find({ isBlocked: 0 }).populate("category_id brand_id")
    const allowedProducts = product.filter(pro => pro.category_id.isListed === 0)

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    const shuffledProducts = shuffle(allowedProducts);
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        res.render('user/home', { user, product: shuffledProducts });
      } else {
        res.render('user/home', { product: shuffledProducts })
      }
    } else {
      res.render('user/home', { product: shuffledProducts });
    }
  } catch (error) {
    console.log(error.message)
  }
}

const loadLogin = async (req, res) => {
  try {
    const redirectUrl = req.query.redirect || '/'
    res.render('user/login', { redirectUrl })
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

const editprofile = async (req, res) => {
  try {
    const { fname, lname, mobile} = req.body
    await User.findOneAndUpdate({_id:req.userid},{fname:fname,lname:lname,mobile:mobile})
    res.redirect('/myAccount')
  }catch(error){
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

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const isRegisteredUser = await User.findOne({ email: email });

    if (isRegisteredUser) {
      const payload = { id: isRegisteredUser._id };
      const secret = process.env.JWT_secret + isRegisteredUser.password;
      const token = jwt.sign(payload, secret, { expiresIn: "10m" })
      const link = `http://localhost:5000/resetPassword?id=${isRegisteredUser._id}&token=${token}`;
      console.log(link);
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

      const mailSend = await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
        to: email,
        subject: "Reset Password",
        text: `Reset Password link ${link}`,
        html: `<b>  <h4 >Reset Password link ${link}</h4>    <br>  </b>`,
      })

      if (mailSend) {
        console.log("mail");
        res.render("user/forgotPass", {
          success: "A link is send to your e-mail.",
        });
      }
    } else {
      res.render("user/forgotPass",
        { err: "User not registered" }
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};


const resetPassword = async (req, res) => {

  try {
    const { id, token } = req.query;
    const matchUser = await User.find({ _id: id })

    console.log(matchUser);

    if (matchUser.length > 0) {
      if (token) {
        const secret = process.env.JWT_secret + matchUser[0].password;
        const isVerified = jwt.verify(token, secret);
        console.log(isVerified);
        if (isVerified) {
          res.render("user/changePass", { id: matchUser[0]._id });
        } else {
          console.log("Error 1");
        }
      } else {
        console.log("Error 2")
      }
    } else {
      console.log("Error 3")
    }
  } catch (error) {
    console.log(error.message);
  }

}

const saveResetPassword = async (req, res) => {

  try {

    const { id, npassword, cpassword } = req.body
    if (npassword === cpassword) {
      const passwordHash = await securePassword(npassword)
      await User.updateOne({ _id: id }, { password: passwordHash })
      res.redirect('/login')
    } else {
      console.log("Error Password Does not match");
    }
  } catch (error) {
    console.log(error.message);
  }

}



const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const logUser = await User.findOne({
      email: email,
      isAdmin: 0,
    })
    const redirectUrl = req.body.redirectUrl || '/'
    if (logUser != null) {
      const passtrue = await bcrypt.compare(password, logUser.password)
      if (passtrue) {
        const id = logUser._id.toString();
        const payload = {
          _id: id,
        };
        const token = jwttoken.createtoken(payload);
        res.cookie("token", token, { secure: true, httpOnly: true })

        res.redirect(redirectUrl)
      } else {
        res.render('user/login', { err: "Invalid password", redirectUrl })
      }
    } else {
      res.render('user/login', { err: "User Blocked", redirectUrl })
    }
  } catch (err) {
    console.log(err.message);
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
    const { fname, lname, email, mobile, password, cpassword } = req.body
    const findUser = await User.findOne({ email });
    if (password === cpassword) {
      if (!findUser) {
        var otp = generateOtp();
        const transporter = nodemailer.createTransport({
          service: "gmail",
          port: 587,
          secure: true,
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

        if (info) {
          req.session.userOtp = otp
          setTimeout(() => {
            req.session.userOtp = null
            req.session.save()
          }, 60000)

          req.session.userData = req.body

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
      console.log("Password is not Matching")
      res.render("user/register", { message: "The password is not matching" })
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
      const id = saveUserData._id
      const payload = {
        _id: id,
      };
      const token = jwttoken.createtoken(payload);
      res.cookie("token", token, { secure: true, httpOnly: true })
      res.redirect('/')
      req.session.user = saveUserData._id
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

    if (info) {

      console.log(newOtp, "newOtp")
      req.session.userOtp = newOtp
      res.redirect('/verifyotp')

    } else {
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
  editprofile,
  loadLogin,
  login,
  loadRegister,
  registerUser,
  getOtpPage,
  verifyOtp,
  resendOtp,
  loadForgotPassword,
  changePassword,
  sendEmail,
  resetPassword,
  saveResetPassword,
  logout
}


