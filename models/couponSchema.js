const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema({
    couponname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    couponcode:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"1"
    },
    couponlimit:{
        type:Number,
        required:true
    },
    reductionrate:{
        type:Number,
        required:true
    },
    isListed:{
        type:Number,
        default:0
    }
})

const Coupon = mongoose.model("coupon",couponSchema)

module.exports = Coupon