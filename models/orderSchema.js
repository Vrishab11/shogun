const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    date:{
        type:Date,
        required:true
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'address',
        required:true
    },
    products:[{
        product_id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product',
            required:true
        },
        qty:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        },
        status:{
            type:String,
            default:"Processing"
        }
    }], 
    payment_method:{
        type:String,
        required:true
    },
    payment_status:{
        type:String,
        default:"Pending"
    },
    order_id:{
        type:String,
        default:"NIL"
    },
    payment_id:{
        type:String,
        default:"NIL"
    },
    total_amount:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:"Processing"
    }
})

const Order = mongoose.model('order',orderSchema)

module.exports = Order