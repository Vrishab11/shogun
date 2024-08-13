const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Address = require("../models/addressSchema");
const Order = require("../models/orderSchema");
const Wallet = require("../models/walletSchema");
const RazorPay = require("../utils/razorpay");
const mongoose = require("mongoose");


const loadPayment = async (req, res) => {
  try {
    const uid = req.userid
    const addid = req.cookies.addressid
    const totalamount = req.cookies.totalamount
    const user = await User.findById({ _id: uid }).populate("cart.product_id")
    let products = user.cart.map(item => ({
      product_id: item.product_id._id,
      qty: item.qty,
      price: item.product_id.price,
    }));
    let proext = [];
    for (let i = 0; i < products.length; i++) {
      let data = await Product.findById({
        _id: products[i].product_id,
      }).populate({ path: "category_id", match: { status: 0 } });
      if (data.category_id !== null) {
        proext.push({
          product_id: data,
          qty: products[i].qty,
          price: products[i].price,
        });
      }
    }
    const udata = await User.findById({ _id: uid }).populate("cart.product_id");
    const addData = await Address.findById({ _id: addid });
    if (addData != null) {
      res.render("user/payment", { user: udata, addData: addData, proext: proext, totalamount });
    }
  } catch (err) {
    console.log(err.message);
  }
}

const paymentConfirm = async (req, res) => {
  try {
    const uid = req.userid;
    const { paymethod } = req.query;
    const addid = req.cookies.addressid;
    const totalamount = req.cookies.totalamount;
    const user = await User.findById({ _id: uid }).populate("cart.product_id")
    let products = user.cart.map(item => ({
      product_id: item.product_id._id,
      qty: item.qty,
      price: item.product_id.price,
    }));
    let totarray = [];
    for (let i = 0; i < products.length; i++) {
      let pertot = products[i].price * products[i].qty;
      totarray.push(pertot);
    }

    const total = totalamount;

    let paystatus;

    if (paymethod === "COD") {
      paystatus = "Paid";
    } else if (paymethod === "Wallet") {
      const walletdata = await User.findById({ _id: uid });
      if (walletdata.wallet >= total) {
        paystatus = "Paid";
      } else {
        return res.json({ walleterr: "Insufficient Wallet Balance!!" });
      }
    } else {
      paystatus = "Pending";
    }

    const orderdata = {
      date: Date.now(),
      user_id: uid,
      address_id: addid,
      products: products,

      payment_method: paymethod,
      payment_status: paystatus,
      total_amount: total,
    };
    const orderSaved = await Order.create(orderdata);
    console.log("ordec", orderSaved);
    if (orderSaved != null) {
      for (let j = 0; j < products.length; j++) {
        const udel = await User.findOneAndUpdate(
          { _id: uid },
          { $pull: { cart: { product_id: products[j].product_id } } }
        );
        const stockreduc = await Product.findByIdAndUpdate(
          { _id: products[j].product_id },
          { $inc: { stock: -products[j].qty } }
        );
      }
      if (orderSaved.payment_method === "COD") {
        res.json({ cod: orderSaved._id });
      } else if (orderSaved.payment_method === "razorpay") {
        const razorOrderId = await RazorPay.createPayOrder(
          orderSaved._id,
          orderSaved.total_amount
        );
        const addOrderid = await Order.findByIdAndUpdate(
          { _id: orderSaved._id },
          { $set: { order_id: razorOrderId.id } },
          { new: true }
        );
        console.log(addOrderid.order_id);
        const udata = await User.aggregate([
          { $match: { _id: new mongoose.Types.ObjectId(uid) } },
        ]);
        res.json({
          razorpay: {
            id: razorOrderId.id,
            amount: razorOrderId.amount,
            userdata: udata[0],
            orderId: orderSaved._id,
          },
        });
      } else {
        let walletHistoryData = {
          order_id: orderSaved._id,
          redeemedamount: orderSaved.total_amount,
          payment_method: orderSaved.payment_method,
          user_id: orderSaved.user_id,
          date: Date.now(),
        };
        const walletHistory = await Wallet.create(walletHistoryData);
        const reduceWallet = await User.findByIdAndUpdate(
          { _id: uid },
          { $inc: { wallet: -orderSaved.total_amount } },
          { new: true }
        );
        if (reduceWallet) {
          res.json({ wallet: orderSaved._id });
        } else {
          console.log("error in wallet");
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorPayId, razorOrderId, razorSignature, realOrderID } = req.body;
    console.log(razorPayId, razorOrderId, razorSignature, realOrderID);
    const { createHmac } = require("node:crypto");

    const orderdata = await Order.findById({ _id: realOrderID });
    const secret = process.env.razor_KEY;
    const hash = createHmac("sha256", secret)
      .update(orderdata.order_id + "|" + razorPayId)
      .digest("hex");
    console.log(hash);
    if (hash === razorSignature) {
      const updateStatus = await Order.findByIdAndUpdate(
        { _id: realOrderID },
        { $set: { payment_status: "Paid", payment_id: razorPayId } }
      );
      console.log("Success");
      res.json({ success: realOrderID });
    } else {
      console.log("Failure");
      res.json({ failure: realOrderID });
    }
  } catch (error) {
    console.log(error.message);
  }
}



module.exports = {
  loadPayment,
  paymentConfirm,
  verifyPayment
}