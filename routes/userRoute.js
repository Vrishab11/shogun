const express = require('express')
const router = express.Router()
const userAuth = require("../middleware/userAuth")

const userController = require("../controllers/userController") 
const productController = require("../controllers/productController")
const cartController = require("../controllers/cartController")



router.get('/', userAuth.isHome, userController.getHome);

router.get('/login', userAuth.notLogged, userController.loadLogin)
router.post('/login', userAuth.notLogged, userController.login)

router.get('/forgotPassword', userAuth.notLogged, userController.loadForgotPassword)
router.post('/forgotPassword', userAuth.notLogged, userController.sendEmail)

router.get('/resetPassword', userAuth.notLogged, userController.resetPassword)
router.post('/resetPassword', userAuth.notLogged, userController.saveResetPassword)

router.get('/logout', userAuth.isLogged, userController.logout)

router.get('/register', userAuth.notLogged, userController.loadRegister)
router.post('/register', userAuth.notLogged, userController.registerUser)

router.get('/verifyotp', userAuth.notLogged, userController.getOtpPage)
router.post('/verifyotp', userAuth.notLogged, userController.verifyOtp)
router.post('/verifyotp/resendOtp', userAuth.notLogged, userController.resendOtp)

router.get('/myAccount',userAuth.isLogged, userController.getProfile)
router.post('/myAccount/changePass', userAuth.isLogged, userController.changePassword)

router.get('/productDetails', userAuth.isHome, productController.viewProduct)

router.get('/shop', userAuth.isHome, productController.viewShop)

router.get('/cart', userAuth.isLogged, cartController.viewCart)
router.get('/addToCart', userAuth.isLogged, cartController.addToCart)

router.get('/checkout', userAuth.isLogged, cartController.checkout)


module.exports = router