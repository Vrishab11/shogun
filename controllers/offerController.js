const Offer = require("../models/offerSchema");

const loadOffer = async (req, res) => {
    try {
        const offerdata = await Offer.find({})
        res.render("admin/offer", { offer: offerdata });
    } catch (error) {
        console.log(error.message);
    }
};

const addOffer = async (req, res) => {
    try {
        const { offertitle, isListed, discount } = req.body;
        const offerdata = {
            offertitle,
            isListed,
            discount
        };
        const existing = await Offer.findOne({ offertitle: offertitle })
        if (!existing) {
            const offerAdd = await Offer.create(offerdata);
            if (offerAdd) {
                res.redirect("/admin/offers");
            }
        } else {
            res.json({ error: "Existing offer" })
        }
    } catch (error) {
        console.log(error.message);
    }
}

const listUnlistOffer = async (req, res) => {

    try {
        const { id } = req.query
        const offerdata = await Offer.findOne({ _id: id })
        if (offerdata !== null) {
            if (offerdata.isListed == 1) {
                const list = await Offer.findOneAndUpdate(
                    { _id: id },
                    { $set: { isListed: 0 } },
                    { new: true }
                )
                if (list !== null) {
                    res.json({ listed: "Offer is listed" })
                } else {
                    res.json({ err: "Error in listing" })
                }
            } else {
                const unlist = await Offer.findOneAndUpdate(
                    { _id: id },
                    { $set: { isListed: 1 } },
                    { new: true }
                )
                if (unlist !== null) {
                    res.json({ unlisted: "Offer is unlisted" })
                } else {
                    res.json({ err: "Error in unlisting" })
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
    loadOffer,
    addOffer,
    listUnlistOffer
}