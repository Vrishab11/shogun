const User = require("../models/userSchema");
const Products = require("../models/productSchema");

const addToWishlist = async (req, res) => {
    try {
      const uid = req.userid;
      if(uid){
        const { productid } = req.query;
        if(productid){
          const addtowish = await User.findByIdAndUpdate(
              { _id: uid },
              { $push: { wishlist: { product_id: productid } } },
              { new: true }
            );
            if (addtowish) {
              res.json({ success: "Added to wishlist" });
            } else {
              res.json({ adderr: "Cannot add to wishlist" });
            }
        }
      }else{
        res.json({ usererr: "Do you wish to login ?" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const removeFromWishlist = async (req, res) => {
    try {
      const uid = req.userid;
      const { productid } = req.query;
      const remfromwish = await User.findByIdAndUpdate(
        { _id: uid },
        { $pull: { wishlist: { product_id: productid } } },
        { new: true }
      );
      if (remfromwish) {
        res.json({ success: "removed" });
      } else {
        res.json({ adderr: "Cannot remove" });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const loadWishlist = async (req, res) => {
    try {
      const uid = req.userid;
      const udata = await User.findById({ _id: uid }).populate(
        "cart.product_id wishlist.product_id"
      );
      res.render("user/wishlist", { user: udata });
    } catch (error) {
      console.log(error.message);
    }
  };


module.exports = {
    loadWishlist,
    addToWishlist,
    removeFromWishlist
}