const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    streetAddress:{
        type:String,
        required:true
    },
    landmark:{
        type:String,
        required:true
    },
    isListed:{
        type:Number,
        default:0
    }
})

const Address = mongoose.model('address',addressSchema)

module.exports = Address