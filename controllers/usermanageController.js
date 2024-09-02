const User = require("../models/userSchema")


const viewUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalUsers = await User.countDocuments({ isAdmin: 0 });

        const udata = await User.find({ isAdmin: 0 }).skip(skip).limit(limit)

        const totalPages = Math.ceil(totalUsers / limit)

        res.render('admin/users', { udata: udata,currentPage: page, totalPages: totalPages, limit: limit })
    } catch (error) {
        console.log(error.message)
    }
}

const blockUnblockUser = async (req, res) => {
    try {
        const { id } = req.query
        const state = await User.findById({ _id: id })
        if (state !== null) {
            if (state.isBlocked === true) {
                const unblock = await User.findOneAndUpdate(
                    { _id: id },
                    { $set: { isBlocked: false } },
                    { new: true }
                )
                if (unblock !== null) {
                    res.json({ unblocked: "User unblocked" })
                } else {
                    res.json({ err: "Error in unblocking" })
                }
            } else {
                const block = await User.findOneAndUpdate(
                    { _id: id },
                    { $set: { isBlocked: true } },
                    { new: true }
                )
                if (block !== null) {
                    res.json({ blocked: "User blocked" })
                } else {
                    res.json({ err: "Error in blocking" })
                }
            }
        } else {
            console.log('No action performed')
        }
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {
    viewUsers,
    blockUnblockUser
}