const User = require("../models/userSchema");
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");



const loadOrdered = async (req, res) => {
    try {
      const uid = req.userid;
      const orderid = req.query.id;
      
      const udata = await User.findById({ _id: uid }).populate("cart.product_id");
      const orderdata = await Order.findById({ _id: orderid }).populate(
        "products.product_id"
      );
      if (orderdata != null) {
        res.render("user/ordered", {udata: udata,orderdata: orderdata});
      }
    } catch (error) {
      console.log(error.message);
    }
};

const loadOrders = async (req, res) => {
    try {
      const uid = req.userid;
      const udata = await User.findById({ _id: uid }).populate("cart.product_id");
      const orderdata = await Order.find({ user_id: uid, payment_status: "Paid" })
        .populate("products.product_id")
        .sort({ date: "desc" });

      if (orderdata.length > 0) {
        res.render("user/orders", {user : udata,orderdata: orderdata});
      } else {
        res.render("user/orders", {user: udata,err: "No Orders Added!!"});
      }
    } catch (error) {
      console.log(error.message);
    }
};

const viewOrders = async (req, res) => {
    try {
        const orderdata = await Order.find({}).populate("address_id").populate('products.product_id')
        res.render('admin/orders',{orders: orderdata});
    } catch (error) {
        console.log(error.message)
    }
}

const viewOrderSummery = async (req, res) => {
    try {
        const order_id = req.query.id
        const orderdata = await Order.findById({_id:order_id}).populate("address_id")
        res.render('admin/orderDetails',{orders: orderdata});
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadOrdered,
    loadOrders,
    viewOrders,
    viewOrderSummery,
}