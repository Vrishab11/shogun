const mongoose = require("mongoose")
require('dotenv').config()

const connectDB =()=>{
  mongoose.connect(process.env.MONGO_URL)
  .then(()=>{
  console.log("db connected");
})
.catch((err)=>{
  console.log(err.message);
})
}


module.exports = {connectDB}  