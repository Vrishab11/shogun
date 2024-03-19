const mongoose = require('mongoose')

const brandSchema = new mongoose.Schema({
    brandname:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    isListed:{
        type:Number,
        default:0
    }
})

const Brand = mongoose.model("brand",brandSchema)

module.exports = Brand