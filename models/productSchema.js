const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now()
    },
    productname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    color:{
        type:String,
        required:true
    },
    brand_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'brand'
    },
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'category'
    },
    price:{
        type:Number,
        required:true
    },
    mainimage:{
        type:String,
        required:true
    },
    image:{
        type:Array,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    offer_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'offer',
        default:null
    },
    isBlocked:{
        type:Number,
        default:0
    }
})

const Product = mongoose.model('product',productSchema)

module.exports = Product