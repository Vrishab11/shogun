const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    offertitle:{
        type:String,
        required:true
    },
    isListed:{
        type:Number,
        required:true,
        default:0
    },
    discount:{
        type:Number,
        required:true
    }
})

const Offer = mongoose.model('offer',offerSchema)

module.exports = Offer