const User = require("../models/userSchema");
const Order = require("../models/orderSchema");
const Product = require("../models/productSchema");
const Wallet = require("../models/walletSchema");
const Coupon = require("../models/couponSchema");
const { ObjectId } = require('mongodb')
const path = require('path')
const fs = require('fs')
const PDFDocument = require('pdfkit');


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

    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments({ user_id: uid });

    const udata = await User.findById({ _id: uid }).populate("cart.product_id");
    const orderdata = await Order.find({ user_id: uid })
      .populate("products.product_id")
      .sort({ date: "desc" })
      .skip(skip)
      .limit(limit);
    const totalPages = Math.ceil(totalOrders / limit)
    if (orderdata.length > 0) {
      res.render("user/order", { user: udata, orderdata: orderdata, currentPage: page, totalPages: totalPages });
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
      "products.product_id address_id coupon"
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    const orderdata = await Order.find({}).sort({ date: "desc" }).skip(skip).limit(limit).populate("address_id products.product_id")
    const totalPages = Math.ceil(totalOrders / limit)
    res.render('admin/orders', { orders: orderdata, currentPage: page, totalPages: totalPages, limit: limit });
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
    const uid = req.userid
    const { oid, pid } = req.query;
    const returndata = await Order.findOneAndUpdate(
      { _id: oid, "products.product_id": pid },
      { $set: { "products.$.status": "Returned" } },
      { new: true }
    );
    await Order.findOneAndUpdate({ _id: oid, "products.product_id": pid },
      { $set: { "status": "Returned" } },
      { new: true }
    )
    console.log("sdadasdas",returndata);

    const user = await User.findOne({ _id: uid })
    if (returndata != null) {
      let qtytoupdate = 0;
      let tot = 0;
      returndata.products.forEach((el) => {
        if (el.product_id == pid && el.status == "Returned") {
          qtytoupdate = el.qty;
          tot = el.price
        }
      })
      if (returndata.payment_method === "razorpay" || returndata.payment_method === "wallet") {
        let amounttorefund = tot;
        console.log(amounttorefund)

        const walletupdate = await User.findOneAndUpdate(
          { _id: uid },
          { $inc: { wallet: amounttorefund } },
          { new: true }
        )
        let walletHistoryData = {
          order_id: oid,
          refundamount: tot,
          payment_method: returndata.payment_method,
          user_id: returndata.user_id,
          date: Date.now(),
        };
        const walletHistory = await Wallet.create(walletHistoryData);
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
    await Order.findOneAndUpdate({ _id: oid, "products.product_id": pid },
      { $set: { "status": "Cancelled" } },
      { new: true }
    )

    console.log("aaaaa",cancelData);

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
        cancelData.payment_method === "razorpay" ||
        cancelData.payment_method === "wallet"
      ) {
        console.log("cancelled");
        
        let amounttorefund = tot;
        console.log("amounttorefund", amounttorefund);
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
          { $inc: { wallet: amounttorefund } },
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
    const user = await User.findOne({ _id: uid });
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
      total_amount += (el.products.qty * el.productdetails.price);
      products.push({
        item: el.productdetails.productname,
        quantity: el.products.qty,
        price: el.productdetails.price,
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
      date: currentdate
    };

    const doc = new PDFDocument();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceDetail.order_number}.pdf`);

    doc.pipe(res);

    doc.image(path.join(__dirname, '../public/images/logo.png'), 50, 45, { width: 100 })
      .fontSize(20)
      .text('Shogun', 110, 57)
      .fontSize(10)
      .text('123 William Street 1th Floor New York, NY 123456', 200, 65, { align: 'right' })
      .text('Order Invoice', 200, 80, { align: 'right' })
      .moveDown();

    doc.text(`Invoice to: ${invoiceDetail.shipping.name}`, 50, 150)
      .text(invoiceDetail.shipping.address, 50, 165)
      .text(`${invoiceDetail.shipping.city}, ${invoiceDetail.shipping.state}, ${invoiceDetail.shipping.country}`, 50, 180)
      .text(invoiceDetail.shipping.postal_code, 50, 195)
      .moveDown();

    doc.text(`Invoice Number: ${invoiceDetail.order_number}`, 50, 250)
      .text(`Date: ${invoiceDetail.date}`, 50, 265)
      .moveDown();

    doc.fontSize(12).text('Item', 50, 320)
      .text('Quantity', 200, 320)
      .text('Price', 300, 320, { align: 'right' });

    let yPosition = 340;
    invoiceDetail.items.forEach(item => {
      doc.text(item.item, 50, yPosition)
        .text(item.quantity, 200, yPosition)
        .text(`RS ${item.price}`, 300, yPosition, { align: 'right' });
      yPosition += 20;
    });

    doc.text(`Total: RS ${invoiceDetail.total}`, 300, yPosition + 20, { align: 'right' });

    doc.text('Thank You', 50, 700, { align: 'center', width: 500 });

    doc.end();

  } catch (error) {
    console.log(error);
    res.status(500).send('Error generating invoice');
  }
};




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