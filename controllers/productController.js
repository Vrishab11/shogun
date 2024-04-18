const Product = require("../models/productSchema")
const Category = require("../models/categorySchema")
const Brand = require("../models/brandSchema")
const fs = require("fs").promises
const path = require("path")


const getProducts = async (req, res) => {
  try {
    const bdata = await Brand.find({ isListed: 0 });
    const cdata = await Category.find({ isListed: 0 });
    const prodata = await Product.find({});
    res.render("admin/products", { products: prodata, category: cdata, brand: bdata });
  } catch (error) {
    console.log(error.message);
  }
}

const addProduct = async (req, res) => {
  try {
    const {
      productname,
      description,
      color,
      size,
      brandname,
      procategory,
      price,
      stock,
      cropvaluesmain,
      cropvaluesimg1,
      cropvaluesimg2,
      cropvaluesimg3,
      cropvaluesimg4,
    } = req.body;

    let protrim = productname.trim();
    const isExist = await Product.find({ productname: protrim })
    console.log(isExist)

    if (isExist.length === 0) {
      const croppedmain = cropvaluesmain ? JSON.parse(cropvaluesmain) : null
      const cropped1 = cropvaluesimg1 ? JSON.parse(cropvaluesimg1) : null
      const cropped2 = cropvaluesimg2 ? JSON.parse(cropvaluesimg2) : null
      const cropped3 = cropvaluesimg3 ? JSON.parse(cropvaluesimg3) : null
      const cropped4 = cropvaluesimg4 ? JSON.parse(cropvaluesimg4) : null

      async function cropAndSave(
        inputPath,
        outputFilePath,
        x,
        y,
        width,
        height) {
        try {
          const image = await Jimp.read(inputPath);
          image.crop(x, y, 200, 200);
          await image.writeAsync(outputFilePath);
          console.log("Image saved successfully!");
        } catch (error) {
          console.error("Error:", error);
        }
      }

      if (croppedmain != null) {
        const inputImagePath = path.join(
          __dirname,
          "../images",
          req.files["mainimage"][0].filename
        )
        const outputImagePath = path.join(
          __dirname,
          "../images",
          req.files["mainimage"][0].filename
        )
        cropAndSave(
          inputImagePath,
          outputImagePath,
          croppedmain.x,
          croppedmain.y,
          croppedmain.width,
          croppedmain.height
        )
      }

      if (cropped1 != null) {
        const inputImagePath = path.join(
          __dirname,
          "../images",
          req.files["imgs"][0].filename
        );
        const outputImagePath = path.join(
          __dirname,
          "../images",
          req.files["imgs"][0].filename
        );
        cropAndSave(
          inputImagePath,
          outputImagePath,
          cropped1.x,
          cropped1.y,
          cropped1.width,
          cropped1.height
        );
      }

      if (cropped2 != null) {
        const inputImagePath = path.join(
          __dirname,
          "../images",
          req.files["imgs"][0].filename
        );
        const outputImagePath = path.join(
          __dirname,
          "../images",
          req.files["imgs"][0].filename
        );
        cropAndSave(
          inputImagePath,
          outputImagePath,
          cropped2.x,
          cropped2.y,
          cropped2.width,
          cropped2.height
        );
      }

      if (cropped3 != null) {
        const inputImagePath = path.join(
          __dirname,
          "../images",
          req.files["imgs"][0].filename
        );
        const outputImagePath = path.join(
          __dirname,
          "../assets",
          req.files["imgs"][0].filename
        );
        cropAndSave(
          inputImagePath,
          outputImagePath,
          cropped3.x,
          cropped3.y,
          cropped3.width,
          cropped3.height
        );
      }

      if (cropped4 != null) {
        const inputImagePath = path.join(
          __dirname,
          "../images",
          req.files["imgs"][0].filename
        );
        const outputImagePath = path.join(
          __dirname,
          "../images",
          req.files["imgs"][0].filename
        );
        cropAndSave(
          inputImagePath,
          outputImagePath,
          cropped4.x,
          cropped4.y,
          cropped4.width,
          cropped4.height
        );
      }

      const main = req.files["mainimage"][0].filename;
      let img = []
      req.files["imgs"].forEach((element) => {
        img.push(element.filename);
      })
      console.log(main)
      console.log(img)

      const prodata = {
        productname,
        description,
        size,
        color,
        brand_id: brandname,
        category_id: procategory,
        price,
        mainimage: main,
        image: img,
        stock
      }

      console.log(prodata);

      const prosaved = await Product.create(prodata);
      if (prosaved != null) {
        res.redirect("/admin/products");
      } else {
        console.log(prosaved);
      }

    } else {
      const bdata = await Brand.find({ status: 1 })
      const cdata = await Category.find({ status: 0 })
      res.render("admin/products", {
        err: "Product Already Exists.",
        brand: bdata,
        category: cdata
      })
    }
  } catch (error) {
    console.log(error.message)
  }
}


const editProduct = async (req, res) => {

  try {
    const id = req.query.id
    const prodata = await Product.findOne({ _id:id }).populate( "category_id brand_id")
    console.log(prodata);
    const bdata = await Brand.find({ status: 1 })
    const cdata = await Category.find({ status: 0 })
    res.render('admin/editProduct',{ product:prodata, brand: bdata, category: cdata })
  } catch (error) {
    console.log(error.message)
  }

}

const saveEditProduct = async (req, res) => {

try{  
  const id = req.body.id
  const { productname, size, color, stock, brandname, procategory, description, mainimage, imgs} = req.body
  await Product.updateOne({_id:id},{productname:productname, size:size, color:color, stock:stock, brand_id:brandname, category_id: procategory, description:description, mainimage:mainimage, image:imgs})
  res.redirect('/admin/products')
}catch(error){
  console.log(error.message)
} 


}


const viewProduct = async (req, res) => {

  try {
    const id = req.query.id
    const user = req.user
    const product = await Product.findOne({ _id:id }).populate("category_id brand_id")
    // console.log(product)
    res.render('user/productDetails',{product,user})
  } catch (error) {
    console.log(error.message)
  }

}

const viewShop = async (req, res) => {

  try {
    const user = req.user
    const product = await Product.find({isBlocked:0}).populate("category_id brand_id")
    const allowedProducts = product.filter(pro=>pro.category_id.isListed === 0)
    res.render('user/shop', {product:allowedProducts,user})
  } catch (error) {
    console.log(error.message);
  }

}

const productListUnlist = async (req, res) => {

  try{
    const { id } = req.query
    const state = await Product.findById({_id:id})
    if(state !== null){
        if(state.isBlocked === 0){
            const list = await Product.findOneAndUpdate(
                {_id: id},
                {$set: { isBlocked: 1}},
                {new: 0}
            )
            if(list !== null){
                res.json({unlist:"Product is listed"})
            }else{
                res.json({err:"Error in unlisting"})
            }
        }else{
            const unlist = await Product.findOneAndUpdate(
                {_id: id},
                {$set: { isBlocked: 0}},
                {new: 0}
            )
            if(unlist !== null){
                res.json({list:"Product is unlisted"})
            }else{
                res.json({err:"Error in unlisting"})
            }
        }
    }else{
        console.log('No action performed')
    }
}catch(error){
    console.log(error.message)
}

}

module.exports = {

  addProduct,
  getProducts,
  editProduct,
  saveEditProduct,
  viewProduct,
  productListUnlist,
  viewShop

}