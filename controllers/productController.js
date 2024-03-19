const Product = require("../models/productSchema")
const Category = require("../models/categorySchema")
const fs = require("fs").promises
const path = require("path")


const getProducts = async (req, res) => {
    try {
        const prodata = await Product.find({ isBlocked: 0 });
        res.render("admin/products", { products: prodata });
    } catch (error) {
        console.log(error.message);
    }
}

const getAddProduct = async (req, res) => {
    try {
        res.render('admin/addProduct')
    } catch (error) {
        console.log(error.message)
        
    }
}

const addProduct = async (req, res) => {
    try {
        
    } catch(error) {
        console.log(error.message)
    }
}

module.exports = {
    getAddProduct,
    addProduct,
    getProducts
}