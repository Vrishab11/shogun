const path = require("path")
const fs = require("fs").promises
const Category = require("../models/categorySchema")

const loadCategory = async (req, res) => {
  try {
    const catdet = await Category.find({});
    if (catdet != null) {
      res.render("admin/category", { catdet });
    } else {
      res.render("admin/category", { catdet });
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
    const cat = await Category.find({});
    for(let i=0; i<cat.length; i++) {
      if(cat[i].categoryname.toLowerCase() === catName.toLowerCase()) {
        const catdet = await Category.find({ isListed: 0 });
        res.render("admin/category", {
          catdet,
          message: "Category already exists!!",
        });
      }
    }
    const catdata = await Category.create(data);
    if (catdata != null) {
      res.redirect("/admin/category");
    }
  } catch (error) {
    console.log(error.message)
  }

}


const editCategory = async (req, res) => {
  try {
    const id = req.query.id;
    const catdata = await Category.findById({ _id: id });
    res.render("admin/editCategory", { catdata })
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
    const cat = await Category.find({ categoryname: catname })
    const catdata = await Category.findById({ _id: id })
    if (cat.length && !cat[0]._id.equals(id)) {
      res.render("admin/editCategory", {
        data: catdata,
        message: "Category already exists!!",
      });
    } else {
      let updatedCategory
      if (req.file) {
        updatedCategory = await Category.findByIdAndUpdate({ _id: id }, { $set: { categoryname: catname, status: status, image: catimage.filename } }, { new: true });
      } else {
        updatedCategory = await Category.findByIdAndUpdate({ _id: id }, { $set: { categoryname: catname, status: status } }, { new: true });
      }
      console.log(updatedCategory)
      res.redirect("/admin/category");
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while updating the category.");
  }
};

const categoryListUnlist = async (req, res) => {

  try {
    const { id } = req.query
    const state = await Category.findById({ _id: id })
    if (state !== null) {
      if (state.isListed === 0) {
        const list = await Category.findOneAndUpdate(
          { _id: id },
          { $set: { isListed: 1 } },
          { new: 0 }
        )
        if (list !== null) {
          res.json({ unlist: "Category is listed" })
        } else {
          res.json({ err: "Error in unlisting" })
        }
      } else {
        const unlist = await Category.findOneAndUpdate(
          { _id: id },
          { $set: { isListed: 0 } },
          { new: 0 }
        )
        if (unlist !== null) {
          res.json({ list: "Category is unlisted" })
        } else {
          res.json({ err: "Error in unlisting" })
        }
      }
    } else {
      console.log('No action performed')
    }
  } catch (error) {
    console.log(error.message)
  }

}

module.exports = {
  loadCategory,
  addCategory,
  editCategory,
  updateCategory,
  categoryListUnlist
}