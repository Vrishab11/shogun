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
        if(brandExist){
            console.log("brand already exists")
            res.render("admin/brand", {data})
        }else{
            res.render("admin/brand", {data})
            console.log("brand doesnot esist")
        }
    } catch (error) {
        console.log(error.message)
    }
}



module.exports ={

    loadBrand,
    addBrand

}