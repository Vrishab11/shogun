const User = require("../models/userSchema");
const Product = require("../models/productSchema")

const viewCart = async (req, res) => {
    try{
        const uid = req.userid;
        const udata = await User.findById({ _id: uid }).populate("cart.product_id")
        console.log(udata.cart)
        res.render("user/cart", { udata })
    }catch(err){
        console.log(err.message)
    }
}

const addToCart = async (req, res) => {

    try {
        const uid = req.userid
        const { id, qty } = req.query
        const isExist = await User.find({ _id: uid, "cart.product_id": id })
        if (isExist.length === 0) {
          const pdata = await Product.findById({ _id: id }) 
          if (qty <= pdata.stock) {
            const updatedCart = await User.findByIdAndUpdate(
              { _id: uid },
              { $addToSet: { cart: { product_id: id, qty: qty } } }, 
              { new: true } 
            )
            if (updatedCart) {
              pdata.stock = pdata.stock- 1;
              pdata.save();
              res.json({ data: "Added to Cart Succesfully." })
            } else {
              res.json({ err: "Failed in Adding." })
            }
          } else {
            res.json({ stockerr: `Only ${pdata.stock} Items left !!` })
          }
        } else {
          res.json({ err: "Item already exist in Cart." })
        }
      } catch (err) {
        console.log(err.message);
      }

}


const checkout = async (req, res) => {

  try {
    res.render('user/checkout')
  } catch (error) {
    console.log(error)
  }

}

const deleteCart = async (req, res) => {
  try {
    const id = req.userid;
    const { proid } = req.query;
    const delspec = await User.findByIdAndUpdate(
      { _id: id },
      { $pull: { cart: { product_id: proid } } }
    );
    if (delspec) {
      res.json({ data: "Item removed from Cart!!" });
    } else {
      res.json({ err: "Failed" });
    }
  } catch (error) {
    console.log(err.message);
  }
};


module.exports = {
    viewCart,
    addToCart,
    checkout,
    deleteCart
}