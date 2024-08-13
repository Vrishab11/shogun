const Wallet = require("../models/walletSchema");
const User = require("../models/userSchema");


const loadWallet = async (req, res) => {
  try {
    const uid = req.userid;
    const user = await User.findById({ _id: uid }).populate("cart.product_id");
    const wallet = await Wallet.find({ user_id: uid });
    res.render("user/wallet", { user, wallet });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadWallet,
};