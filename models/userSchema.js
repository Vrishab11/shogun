const { default: mongoose } = require("mongoose");
const Mongoose = require("mongoose");

const userSchema = Mongoose.Schema({
    fname: {
        type: String,
        required: true,
        unique: true
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
    }
});

const User = mongoose.model("User",userSchema)

module.exports = User