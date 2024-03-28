const path = require("path")
const fs = require("fs").promises
const Brand = require("../models/brandSchema")

const loadBrand = async (req, res) => {
    try {
      const bData = await Brand.find({ isListed: 0 });
      if (bData != null) {   
        res.render("admin/brand", {bData});
      } else {
        res.render("admin/brand");
      }
    } catch (error) {
      console.log(error.message);
    }
}

const addBrand = async (req, res) => {
    try {
        const {bname,status} = req.body
        const image = req.file.filename
        const data = {
        brandname: bname,
        status: status,
        image: image,
        }
        console.log(data)
        const brandExist = await Brand.find({
            brandname: bname,
            isListed: 0,
          })
        if(brandExist.length===0){
          const bdata = await Brand.create(data);
          if (bdata != null) {
            res.redirect("/admin/brand")
          }
        }else{
          const bData = await Brand.find({ isListed: 0 });
          res.render("admin/brand", {
            data: bData,
            message: "Brand already exists!!",
          });
        }
    } catch (error) {
        console.log(error.message)
    }
}


const editBrand = async (req, res) =>{
  try {
    const id = req.query.id;
    const bData = await Brand.findById({ _id: id });
    res.render("admin/editBrand", {bData})
  } catch (error) {
    console.log(error.message);
  }
}

const updateBrand = async (req, res) => {
  try {
    const id = req.body.id;
    const bname = req.body.bname;
    const status = req.body.status;
    const image = req.file;
    console.log(req.body)
    console.log(req.file);
    const updatedBrand = await Brand.findByIdAndUpdate({_id:id},{$set:{ brandname: bname, status: status, image: image.filename }},{ new: true });

    console.log(updatedBrand)

    res.redirect("/admin/brand");
  } catch (error) {
    console.log(error.message);
    res.status(500).send("An error occurred while updating the brand.");
  }
}


module.exports ={

    loadBrand,
    addBrand,
    editBrand,
    updateBrand

}