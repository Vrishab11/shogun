const mongoose = require("mongoose")
require('dotenv').config()

const connectDB =()=>{
  mongoose.connect("mongodb://127.0.0.1:27017/shogun")
  .then(()=>{
  console.log("db connected");
})
.catch((err)=>{
  console.log(err.message);
})
}


module.exports = {connectDB}  