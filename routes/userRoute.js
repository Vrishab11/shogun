const express = require('express')
const router = express.Router()
const userAuth = require("../middleware/userAuth")

const userController = require("../controllers/userController") 
const productController = require("../controllers/productController")
const wishlistController = require("../controllers/wishlistController")
const cartController = require("../controllers/cartController")
const addressController = require("../controllers/addressController")
const paymentController = require("../controllers/paymentController")
const orderController = require("../controllers/orderController")
const walletController = require("../controllers/walletController")

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
router.post('/editprofile',userAuth.isLogged, userController.editprofile)
router.post('/myAccount/changePass', userAuth.isLogged, userController.changePassword)

router.get('/productDetails', userAuth.isHome, productController.viewProduct)

router.get('/shop', userAuth.isHome, productController.viewShop)

router.get("/wishlist", userAuth.isLogged, wishlistController.loadWishlist);
router.get("/wishlist/add", userAuth.isHome, wishlistController.addToWishlist);
router.get("/wishlist/remove", userAuth.isLogged, wishlistController.removeFromWishlist);

router.get('/cart', userAuth.isLogged, cartController.viewCart)
router.get('/addToCart', userAuth.isHome, cartController.addToCart)
router.get("/cart/qtyinc", userAuth.isLogged, cartController.qtyInc);
router.get("/cart/qtydec", userAuth.isLogged, cartController.qtyDec);
router.get("/cart/deletecart", userAuth.isLogged, cartController.deleteCart);
router.get("/cart/clearcart", userAuth.isLogged, cartController.clearCart)

router.get('/addresses', userAuth.isLogged, addressController.loadAddress)

router.get('/addAddress', userAuth.isLogged, addressController.loadAddAddress)
router.post('/addAddress', userAuth.isLogged, addressController.saveAddress)

router.get('/editAddress', userAuth.isLogged, addressController.loadEditAddress)
router.post('/editAddress', userAuth.isLogged, addressController.editAddress)

router.get("/removeAddress", userAuth.isLogged, addressController.removeAddress)

router.get('/checkout', userAuth.isLogged, cartController.checkout)

router.post('/applyCoupon', userAuth.isLogged, cartController.applyCoupon)
router.post('/removeCoupon', userAuth.isLogged, cartController.removeCoupon)

router.get('/payment', userAuth.isLogged, paymentController.loadPayment)
router.get("/placeorder",userAuth.isLogged,paymentController.paymentConfirm)
router.post("/verifyPayment",userAuth.isLogged ,paymentController.verifyPayment);

router.get('/ordered', userAuth.isLogged, orderController.loadOrdered)
router.get('/orders', userAuth.isLogged, orderController.loadOrders)
router.get("/ordersummary",userAuth.isLogged,orderController.loadSummary);
router.get("/orders/cancel", userAuth.isLogged, orderController.cancelOrder);
router.get("/orders/return", userAuth.isLogged, orderController.returnOrder);

router.get('/wallet', userAuth.isLogged, walletController.loadWallet)

router.get("/generateInvoice",userAuth.isLogged,orderController.generateInvoice);

module.exports = router