const express = require("express")
const router = express.Router()
const upload = require('../utils/multer')


const adminController = require("../controllers/adminController")
const usermanageController = require("../controllers/usermanageController")
const productController = require("../controllers/productController")
const categoryController = require("../controllers/categoryController")
const brandController = require("../controllers/brandController")

const adminAuth = require("../middleware/adminAuth")

router.get("/login", adminAuth.notLogged, adminController.loadLogin)
router.post("/login", adminAuth.notLogged, adminController.login)

router.get("/logout", adminAuth.isLogged, adminController.logout)

router.get("/dashboard", adminAuth.isLogged, adminController.dashboard)

router.get('/viewUsers', adminAuth.isLogged, usermanageController.viewUsers)
router.get('/viewUsers/blockUnblockUser', adminAuth.isLogged, usermanageController.blockUnblockUser)

router.get("/category", adminAuth.isLogged, categoryController.loadCategory)
router.post("/category", adminAuth.isLogged, upload.single('catimage'), categoryController.addCategory)

router.get("/editCategory", adminAuth.isLogged, categoryController.editCategory)
router.post("/editCategory", adminAuth.isLogged, upload.single('catimage'), categoryController.updateCategory)

router.get("/brand", adminAuth.isLogged, brandController.loadBrand)
router.post("/brand", adminAuth.isLogged, upload.single('bimage'), brandController.addBrand)

router.get("/addProduct", adminAuth.isLogged, productController.getAddProduct)
router.post("/addProduct", adminAuth.isLogged, productController.addProduct)

router.get("/products", adminAuth.isLogged, productController.getProducts)



module.exports = router