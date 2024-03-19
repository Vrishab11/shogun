const path = require("path")
const fs = require("fs").promises
const Category = require("../models/categorySchema")
const Product = require("../models/productSchema")

const loadCategory = async (req, res) => {
    try {
      const catdet = await Category.find({ isListed: 0 });
      console.log(catdet);
      if (catdet != null) {   
        res.render("admin/category", {catdet });
      } else {
        res.render("admin/category");
      }
    } catch (error) {
      console.log(error.message);
    }
}

const addCategory = async (req, res) => {

  try {
    const { catName, status } = req.body;
    const image = req.file.filename;
    const data = {
      categoryname: catName,
      status: status,
      image: image,
    };
    console.log(data);
    const catExist = await Category.find({
      categoryname: catName,
      isListed: 0,
    });
    if (catExist.length === 0) {
      const catdata = await Category.create(data);
      if (catdata != null) {
        res.redirect("/admin/category");
      }
    } else {
      const catdet = await Category.find({ isListed: 0 });
      res.render("admin/category", {
        data: catdet,
        message: "Category already exists!!",
      });
    }
  } catch (error) {
    console.log(error.message);
  }

}


module.exports = {
    loadCategory,
    addCategory
}