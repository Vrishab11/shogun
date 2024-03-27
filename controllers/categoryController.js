const path = require("path")
const fs = require("fs").promises
const Category = require("../models/categorySchema")

const loadCategory = async (req, res) => {
    try {
      const catdet = await Category.find({ isListed: 0 });
      // console.log(catdet);
      if (catdet != null) {   
        res.render("admin/category", {catdet});
      } else {
        res.render("admin/category", {catdet});
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
    console.log(error.message)
  }

}


const editCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const catdata = await Category.findById({ _id: id });
    res.render("admin/editCategory", {catdata})
  } catch (error) {
    console.log(error.message)
  }
}

const updateCategory = async (req, res) => {
  try {
    const id = req.body.id;
    const catname = req.body.catName;
    const status = req.body.status;
    const catimage = req.file;
    console.log(req.body)
    console.log(req.file);
    const updatedCategory = await Category.findByIdAndUpdate({_id:id},{$set:{ categoryname: catname, status: status, image: catimage.filename }},{ new: true });

    console.log(updatedCategory)

    res.redirect("/admin/category");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while updating the category.");
  }
};


module.exports = {
    loadCategory,
    addCategory,
    editCategory,
    updateCategory
}