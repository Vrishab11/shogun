const User = require("../models/userSchema");
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const { ObjectId } = require('mongodb')
const path = require('path')


const loadOrdered = async (req, res) => {
  try {
    const uid = req.userid;
    const orderid = req.query.id;

    const udata = await User.findById({ _id: uid }).populate("cart.product_id");
    const orderdata = await Order.findById({ _id: orderid }).populate("products.product_id");
    if (orderdata != null) {
      res.render("user/ordered", { udata: udata, orderdata: orderdata });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadOrders = async (req, res) => {
  try {
    const uid = req.userid;
    const udata = await User.findById({ _id: uid }).populate("cart.product_id");
    const orderdata = await Order.find({ user_id: uid })
      .populate("products.product_id")
      .sort({ date: "desc" });

    if (orderdata.length > 0) {
      res.render("user/order", { user: udata, orderdata: orderdata });
    } else {
      res.render("user/order", { user: udata, err: "No Orders Added!!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadSummary = async (req, res) => {
  try {
    const uid = req.userid;
    const orderid = req.query.id;
    const udata = await User.findById({ _id: uid }).populate("cart.product_id");
    const orderdata = await Order.findById({ _id: orderid }).populate(
      "products.product_id address_id"
    );
    if (orderdata != null) {
      res.render("user/orderSummary", { user: udata, orderdata: orderdata });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const viewOrders = async (req, res) => {
  try {
    const orderdata = await Order.find({}).populate("address_id products.product_id")
    res.render('admin/orders', { orders: orderdata });
  } catch (error) {
    console.log(error.message)
  }
}

const viewOrderSummery = async (req, res) => {
  try {
    const order_id = req.query.id
    const orderdata = await Order.findById({ _id: order_id }).populate("address_id products.product_id")

    res.render('admin/orderDetails', { orders: orderdata });
  } catch (error) {
    console.log(error.message);
  }
}

const changeOrderStatus = async (req, res) => {
  try {

    const orderId = req.query.orderId;
    const userId = req.query.userId;

    await Order.findOneAndUpdate(
      { _id: orderId },
      { $set: { "products.$[elem].status": req.query.status } },
      { arrayFilters: [{ "elem": { $exists: true } }] },
      { new: true }
    );
    await Order.updateMany({ _id: orderId }, { status: req.query.status })
    const findOrder = await Order.findOne({ _id: orderId });
    if (findOrder.status.trim() === "Returned" && (findOrder.payment === "razorpay" || findOrder.payment === "wallet" || findOrder.payment === "cod")) {
      const findUser = await User.findOne({ _id: userId });
      if (findUser && findUser.wallet !== undefined) {
        findUser.wallet += findOrder.totalPrice;
        await findUser.save();
      } else {
        console.log("User not found or wallet is undefined");
      }
      await Order.updateOne({ _id: orderId }, { status: "Returned" });
      for (const productData of findOrder.products) {
        const productId = productData._id
        const quantity = productData.quantity
        const product = await Product.findById(productId);
        if (product) {
          product.quantity += quantity;
          await product.save();
        } else if (!product) {
          console.log("nah product");
        }
      }
    }
    res.redirect('/admin/orders');
  } catch (error) {
    console.log(error.message)
  }
}

const returnOrder = async (req, res) => {
  try {
    const { oid, pid } = req.query;
    const returndata = await Order.findOneAndUpdate(
      { _id: oid, "products.product_id": pid },
      { $set: { "products.$.status": "Returned" } },
      { new: true }
    );
    if (returndata != null) {
      let qtytoupdate = 0;
      let tot = 0;
      returndata.products.forEach((el) => {
        if (el.product_id == pid && el.status == "Returned") {
          qtytoupdate = el.qty;
          tot = el.price
        }
      });
      if (
        returndata.payment_method === "RazorPay" ||
        returndata.payment_method === "Wallet"
      ) {
        let amounttorefund = returndata.tot;
        let walletHistoryData = {
          order_id: oid,
          refundamount: tot,
          payment_method: returndata.payment_method,
          user_id: returndata.user_id,
          date: Date.now(),
        };
        const walletHistory = await Wallet.create(walletHistoryData);
        const walletaddition = await User.findByIdAndUpdate(
          { _id: returndata.user_id },
          { $inc: { wallet: amounttorefund } },
          { new: true }
        )
      }

      const stockUpdate = await Product.findByIdAndUpdate(
        { _id: pid },
        { $inc: { stock: qtytoupdate } }
      );
      if (stockUpdate != null) {
        res.json({ success: "Order Returned!!" });
      } else {
        res.json({ err: "Cannot Return Order!!" });
      }
    } else {
      res.json({ err: "Cannot Return Order!!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { oid, pid } = req.query;
    const cancelData = await Order.findOneAndUpdate(
      { _id: oid, "products.product_id": pid },
      { $set: { "products.$.status": "Cancelled" } },
      { new: true }
    );
    if (cancelData != null) {
      let qtytoupdate = 0;
      let tot = 0;
      cancelData.products.forEach((el) => {
        if (el.product_id == pid && el.status == "Cancelled") {
          qtytoupdate = el.qty;
          tot = el.price
        }
      });
      if (
        cancelData.payment_method === "RazorPay" ||
        cancelData.payment_method === "Wallet"
      ) {
        let amounttorefund = cancelData.tot;
        let walletHistoryData = {
          order_id: oid,
          refundamount: tot,
          payment_method: cancelData.payment_method,
          user_id: cancelData.user_id,
          date: Date.now(),
        };
        const walletHistory = await Wallet.create(walletHistoryData);
        const walletaddition = await User.findByIdAndUpdate(
          { _id: cancelData.user_id },
          { $inc: { walletamount: amounttorefund } },
          { new: true }
        )
      }

      const stockUpdate = await Product.findByIdAndUpdate(
        { _id: pid },
        { $inc: { stock: qtytoupdate } }
      );

      if (stockUpdate != null) {
        res.json({ data: "Order Cancelled!!" });
      } else {
        res.json({ err: "Cannot Cancel Order!!" });
      }
    } else {
      res.json({ err: "Cannot Cancel Order!!" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const generateInvoice = async (req, res) => {
  try {
    const { id } = req.query;

    const uid = req.userid;
    const user = await User.findOne({ _id: uid })
    const orderdata = await Order.aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "addresses",
          localField: "address_id",
          foreignField: "_id",
          as: "addressdetails"
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "productdetails",
        },
      },
      { $unwind: "$productdetails" },
    ]);

    const currentdate = orderdata[0].date.toUTCString().split(" ").slice(1, 4).join(" ");
    let products = [];
    let total_amount = 0;
    orderdata.forEach((el) => {
      total_amount += (el.products.qty * el.productdetails.price)
      products.push({
        item: el.productdetails.productname,
        description: " ",
        quantity: el.products.qty,
        price: el.productdetails.price,
        tax: "0",
      });
    });

    const invoiceDetail = {
      shipping: {
        name: user.fname + " " + user.lname,
        address: orderdata[0].addressdetails[0].streetAddress,
        city: orderdata[0].addressdetails[0].district,
        state: orderdata[0].addressdetails[0].state,
        country: orderdata[0].addressdetails[0].country,
        postal_code: orderdata[0].addressdetails[0].pincode
      },
      items: products,
      total: total_amount,
      order_number: id,
      header: {
        company_name: "Shogun",
        company_logo: path.join(__dirname, 'public/images/logo.png'),
        company_address: "Shogun. 123 William Street 1th Floor New York, NY 123456"
      },
      footer: {
        text: "Thank You"
      },
      currency_symbol: "RS",
      date: {
        billing_date: currentdate
      }
    };


    res.json({ pdfData: invoiceDetail });
  } catch (error) {
    console.log(error);
  }
}


module.exports = {
  loadOrdered,
  loadOrders,
  loadSummary,
  viewOrders,
  viewOrderSummery,
  changeOrderStatus,
  returnOrder,
  cancelOrder,
  generateInvoice
}