const express = require("express")
const router = express.Router()
const upload = require('../utils/multer')


const adminController = require("../controllers/adminController")
const usermanageController = require("../controllers/usermanageController")
const productController = require("../controllers/productController")
const categoryController = require("../controllers/categoryController")
const brandController = require("../controllers/brandController")
const orderController = require("../controllers/orderController")

const adminAuth = require("../middleware/adminAuth")

router.get("/login", adminAuth.notLogged, adminController.loadLogin)
router.post("/login", adminAuth.notLogged, adminController.login)

router.get("/logout", adminAuth.isLogged, adminController.logout)

router.get("/dashboard", adminAuth.isLogged, adminController.dashboard)

router.get('/viewUsers', adminAuth.isLogged, usermanageController.viewUsers)
router.get('/viewUsers/blockUnblockUser', adminAuth.isLogged, usermanageController.blockUnblockUser)

router.get("/category", adminAuth.isLogged, categoryController.loadCategory)
router.post("/category", adminAuth.isLogged, upload.single('catimage'), categoryController.addCategory)
router.get("/category/listUnlist", adminAuth.isLogged, categoryController.categoryListUnlist)

router.get("/editCategory", adminAuth.isLogged, categoryController.editCategory)
router.post("/editCategory", adminAuth.isLogged, upload.single('catimage'), categoryController.updateCategory)

router.get("/brand", adminAuth.isLogged, brandController.loadBrand)
router.post("/brand", adminAuth.isLogged, upload.single('bimage'), brandController.addBrand)
router.get("/brand/listUnlist", adminAuth.isLogged, brandController.brandListUnlist)

router.get("/editBrand", adminAuth.isLogged, brandController.editBrand)
router.post("/editBrand", adminAuth.isLogged, upload.single('image'), brandController.updateBrand)

router.get("/products", adminAuth.isLogged, productController.getProducts)
router.post("/products", adminAuth.isLogged, upload.fields([{ name: "mainimage", maxCount: 1 },{ name: "imgs", maxCount: 4 }]), productController.addProduct)
router.get('/products/listUnlist', adminAuth.isLogged, productController.productListUnlist)

router.get("/editProduct", adminAuth.isLogged, productController.editProduct)
router.post("/editProduct", adminAuth.isLogged, upload.fields([{ name: "mainimage", maxCount: 1 },{ name: "imgs", maxCount: 4 }]), productController.saveEditProduct)

router.get('/orders', adminAuth.isLogged, orderController.viewOrders)
router.get('/orderDetails', adminAuth.isLogged, orderController.viewOrderSummery)

module.exports = router