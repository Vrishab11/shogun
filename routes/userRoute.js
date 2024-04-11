const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController") 
const productController = require("../controllers/productController")
const userAuth = require("../middleware/userAuth")


router.get('/', userAuth.isHome, userController.getHome);

router.get('/login', userAuth.notLogged, userController.loadLogin)
router.post('/login', userAuth.notLogged, userController.login)

router.get('/logout', userAuth.isLogged, userController.logout)

router.get('/register', userAuth.notLogged, userController.loadRegister)
router.post('/register', userAuth.notLogged, userController.registerUser)

router.get('/verifyotp', userAuth.notLogged, userController.getOtpPage)
router.post('/verifyotp', userAuth.notLogged, userController.verifyOtp)
router.post('/verifyotp/resendOtp', userAuth.notLogged, userController.resendOtp)

router.get('/myAccount',userAuth.isLogged, userController.getProfile)
router.post('/myAccount/changePass', userAuth.isLogged, userController.changePassword)

router.get('/productDetails', userAuth.isLogged, productController.viewProduct)

router.get('/shop', userAuth.isLogged, productController.viewShop)



module.exports = router