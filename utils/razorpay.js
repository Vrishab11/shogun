const Razorpay = require("razorpay");
require("dotenv").config()

let instance = new Razorpay({
  key_id: process.env.razor_ID,
  key_secret: process.env.razor_KEY,
});

function createPayOrder(orderid, totamount) {
  var options = {
    amount: totamount*100,
    currency: "INR",
    receipt: orderid,
  };
  return new Promise((resolve,reject)=>{

  
  instance.orders.create(options, function (err, order) {
    if (err) {
      console.log(err);
      reject(err)
    } else {
      console.log("Order"+order);
      resolve(order)
    }
  });
})
}

module.exports = {
  createPayOrder
};