const User = require("../models/userSchema");
const Product = require("../models/productSchema")
const Address = require("../models/addressSchema");
const Coupon = require("../models/couponSchema");
const Order = require("../models/orderSchema");

const viewCart = async (req, res) => {
  try {
    const uid = req.userid;
    const udata = await User.findById({ _id: uid }).populate("cart.product_id")
    res.render("user/cart", { user: udata })
  } catch (err) {
    console.log(err.message)
  }
}

const addToCart = async (req, res) => {
  try {
    const uid = req.userid
    if (uid) {
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
          await Product.findByIdAndUpdate({_id : id},{$inc : { stock: -qty}},{ new: true })
          if (updatedCart) {
            res.json({ data: "Added to Cart Succesfully." })
          } else {
            res.json({ err: "Failed in Adding." })
          }
        } else {
          res.json({ stockerr: `Out of Stock!!` })
        }
      } else {
        res.json({ err: "Item already exist in Cart." })
      }
    } else {
      res.json({ usererr: "Do you wish to login ?" })
    }
  } catch (err) {
    console.log(err.message);
  }

}


const qtyInc = async (req, res) => {
  try {
    const id = req.userid;
    const { qty, proid } = req.query;
    const pdata = await Product.findById({ _id: proid });
    console.log(qty);
    
    if (qty <= pdata.stock) {
      const updatedCart = await User.findOneAndUpdate(
        { _id: id, cart: { $elemMatch: { product_id: proid } } },
        { $set: { "cart.$.qty": qty } },
        { new: true }
      );
      await Product.findByIdAndUpdate({_id : proid},{$inc : { stock: -qty}},{ new: true })
      if (updatedCart) {
        res.json({ data: "Success" });
      } else {
        res.json({ err: "Failed" });
      }
    } else {
      res.json({ stockerr: `Only ${pdata.stock} Items left!!` });
    }
  } catch (error) {
    console.log(error.message);
  }
};


const qtyDec = async (req, res) => {
  try {
    const id = req.userid;
    const { qty, proid } = req.query;
    const pdata = await Product.findById({ _id: proid });
    if (qty <= pdata.stock) {
      const updatedCart = await User.findOneAndUpdate(
        { _id: id, cart: { $elemMatch: { product_id: proid } } },
        { $set: { "cart.$.qty": qty } },
        { new: true }
      );
      await Product.findByIdAndUpdate({_id : proid},{$inc : { stock: qty}}, { new: true })
      console.log(updatedCart);
      if (updatedCart) {
        res.json({ data: "Success" });
      } else {
        res.json({ err: "Failed" });
      }
    } else {
      res.json({ stockerr: `Only ${pdata.stock} Items left!!` });
    }
  } catch (error) {
    console.log(error.message);
  }
};


const deleteCart = async (req, res) => {
  try {
    const id = req.userid;
    const { proid } = req.query;
    const user = await User.findOne({_id:id})
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

const clearCart = async (req, res) => {
  try {
    const id = req.userid
    const user = await User.find({_id: id}).populate('cart.product_id')

    let products = user[0].cart.map((item) => ({
      product_id: item.product_id._id,
      qty: item.qty,
      price: item.product_id.price,
    }));
    
    const clearcart = await User.findOneAndUpdate({ _id: id }, { $set: { cart: [] } }, { new: true })
    if (clearcart) {
      for (const item of products) {
        await Product.findByIdAndUpdate(
          { _id: item.product_id },
          { $inc: { stock: item.qty } },
          { new: true }
        );
      }
      res.json({ data: "Cart Cleared" });
    } else {
      res.json({ err: "Failed" });
    }
  } catch (error) {
    console.log(error.message)
  }
}


const checkout = async (req, res) => {
  try {
    const uid = req.userid
    const couponData = await Coupon.find({status: "0"})
    let flag = 0;
    const udata = await User.findById({ _id: uid }).populate({ path: "cart.product_id" })
    for(let i=0; i<udata.cart.length; i++){
      const productDetails = await Product.findById({_id : udata.cart[i].product_id._id})
      if(productDetails.stock < udata.cart[i].qty){
        flag = 1;
        break;
      }
    }
    const addData = await Address.find({ user_id: uid })
    if(flag === 1){
      res.json({stockerr : ` Stock not available for the product`})
    }else{
      res.render("user/checkout", { user: udata, addData: addData, couponData });
    }
  } catch (error) {
    console.log(error)
  }

}


const applyCoupon = async (req, res) => {
  try {
    const {couponCode,totalAmount} = req.body
    const coupon = await Coupon.findOne({ _id: couponCode });

    if (!coupon) {
        return res.json({ success: false, message: 'Invalid coupon' });
    }

    // Calculate the new total after applying the coupon
    const discount = coupon.reductionrate;
    const newTotal = totalAmount - discount;


    res.json({ success: true, newTotal , discount});
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error applying coupon' });
  }
}


const removeCoupon = async (req, res) =>{
    try {
        const cart  = await User.findOne({_id:req.userid})
        if (!cart) {
            return res.json({ success: false, message: 'Cart not found' });
        }

        // Recalculate the original total without the discount
        const originalTotal = cart.cart.reduce((sum, item) => sum + item.qty * item.product_id.price, 0);

        // Update the cart with the original total
        totalAmount = originalTotal;

        res.json({ success: true, originalTotal });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: 'Error removing coupon' });
    }
}

module.exports = {
  viewCart,
  addToCart,
  qtyInc,
  qtyDec,
  deleteCart,
  clearCart,
  checkout,
  applyCoupon,
  removeCoupon
}