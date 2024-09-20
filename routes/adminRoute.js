const express = require("express")
const router = express.Router()
const upload = require('../utils/multer')


const adminController = require("../controllers/adminController")
const usermanageController = require("../controllers/usermanageController")
const productController = require("../controllers/productController")
const categoryController = require("../controllers/categoryController")
const brandController = require("../controllers/brandController")
const orderController = require("../controllers/orderController")
const couponController = require("../controllers/couponController")
const offerController = require("../controllers/offerController")
const reportController = require("../controllers/reportController")

const adminAuth = require("../middleware/adminAuth")

router.get("/login", adminAuth.notLogged, adminController.loadLogin)
router.post("/login", adminAuth.notLogged, adminController.login)

router.get("/logout", adminAuth.isLogged, adminController.logout)

router.get("/dashboard", adminAuth.isLogged, adminController.dashboard)

router.get("/dashboard/weekreport", adminAuth.isLogged, adminController.weekReport);
router.get("/dashboard/monthreport", adminAuth.isLogged, adminController.monthReport);
router.get("/dashboard/yearreport", adminAuth.isLogged, adminController.yearReport);
router.get("/dashboard/categoryreport", adminAuth.isLogged, adminController.categorySales);
router.get("/dashboard/propage", adminAuth.isLogged, adminController.propage);
router.get("/dashboard/stockpage", adminAuth.isLogged, adminController.stockPage);

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
router.get("/addProduct", adminAuth.isLogged, productController.getAddProducts)
router.post("/products", adminAuth.isLogged, upload.fields([{ name: "mainimage", maxCount: 1 },{ name: "imgs", maxCount: 4 }]), productController.addProduct)
router.get('/products/listUnlist', adminAuth.isLogged, productController.productListUnlist)

router.get("/editProduct", adminAuth.isLogged, productController.editProduct)
router.post("/editProduct", adminAuth.isLogged, upload.fields([{ name: "mainimage", maxCount: 1 },{ name: "imgs", maxCount: 4 }]), productController.saveEditProduct)

router.get('/orders', adminAuth.isLogged, orderController.viewOrders)
router.get('/orderDetails', adminAuth.isLogged, orderController.viewOrderSummery)
router.get("/changeStatus", adminAuth.isLogged, orderController.changeOrderStatus)

router.get('/coupons', adminAuth.isLogged, couponController.loadCoupon)
router.get('/addCoupon', adminAuth.isLogged, couponController.loadAddCoupon)
router.post('/addCoupon', adminAuth.isLogged, couponController.addCoupon)
router.get("/coupons/listUnlist", adminAuth.isLogged, couponController.listUnlistCoupon)

router.get('/offers', adminAuth.isLogged, offerController.loadOffer)
router.post('/offers', adminAuth.isLogged, offerController.addOffer)
router.get("/offers/listUnlist", adminAuth.isLogged, offerController.listUnlistOffer)

router.get('/salesreport', adminAuth.isLogged, reportController.loadReport)
router.get("/salesreport/dailypro", adminAuth.isLogged, reportController.dailyProducts);
router.get("/salesreport/weeklypro", adminAuth.isLogged, reportController.weeklyProducts);
router.get("/salesreport/monthlypro", adminAuth.isLogged, reportController.monthlyProducts);
router.get("/salesreport/yearlypro", adminAuth.isLogged, reportController.yearlyProducts);
router.get("/salesreport/dailyturn", adminAuth.isLogged, reportController.dailyTurnover);
router.get("/salesreport/weeklyturn", adminAuth.isLogged, reportController.weeklyTurnover);
router.get("/salesreport/monthlyturn", adminAuth.isLogged, reportController.monthlyTurnover);
router.get("/salesreport/yearlyturn", adminAuth.isLogged, reportController.yearlyTurnover);
router.get("/salesreport/getrangereport", adminAuth.isLogged, reportController.rangeProducts); 
router.get("/salesreport/getexcelpro", adminAuth.isLogged, reportController.getExcelData);
router.get("/salesreport/getpdfpro", adminAuth.isLogged, reportController.getPdfData);

module.exports = router