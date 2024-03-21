const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryname:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    isListed:{
        type:Number,
        required:true,
        default:0
    }
})

const Category = mongoose.model("category",categorySchema)
module.exports = Category