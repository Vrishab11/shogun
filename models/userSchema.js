const { default: mongoose } = require("mongoose");
const Mongoose = require("mongoose");

const userSchema = Mongoose.Schema({
    date:{
        type:Date,
        default:Date.now()
      },
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdOn: {
        type: String
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: String,
        default: "0"
    },
    cart: {
        type:[
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'product'
                },
                qty: {
                    type: Number
                }
            }
        ],
        default: []
    },
    wishlist: {
        type:[
            {
                product_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:'product'
                }
            }
        ],
        default: []
    },
    wallet: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model("User",userSchema)

module.exports = User