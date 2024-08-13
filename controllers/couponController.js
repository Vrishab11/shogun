const Coupon = require("../models/couponSchema");

const loadCoupon = async (req, res) => {
  try {
    const coupondata = await Coupon.find({});
    res.render("admin/coupon", { coupondata });
  } catch (error) {
    console.log(error.message);
  }
};

const loadAddCoupon = async (req, res) => {
  try {
    res.render('admin/addCoupon');
  } catch (error) {
    console.log(error.message);
  }
}

const addCoupon = async (req, res) => {
  try {
    const { couponname, description, status, limit, reduction, couponcode } =
      req.body;
    const coupondata = {
      couponname,
      description,
      status,
      couponlimit: limit,
      couponcode: couponcode.toUpperCase(),
      reductionrate: reduction,
    };
    const couponexistdata = await Coupon.find({ status: 0 });
    let matched = 0;
    if (couponexistdata) {
      couponexistdata.forEach((el) => {
        if (el.couponname == couponname || el.couponcode == couponcode) {
          matched++;
        }
      });
    }
    if (matched === 0) {
      const addtocoupons = await Coupon.create(coupondata);
      if (addtocoupons) {
        res.redirect("/admin/coupons");
      } else {
        res.render("admin/coupons", {
          message: "can't Add",
          coupondata: couponexistdata,
        });
      }
    } else {
      res.render("admin/admincoupon", {
        message: "Coupon Already Exists",
        coupondata: couponexistdata,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const listUnlistCoupon = async (req, res) => {

  try {
    const { id } = req.query
    const coupondata = await Coupon.findOne({ _id: id })
    if (coupondata !== null) {
      if (coupondata.status == 1) {
        const list = await Coupon.findOneAndUpdate(
          { _id: id },
          { $set: { status: 0 } },
          { new: 0 }
        )
        if (list !== null) {
          res.json({ listed: "Coupon is listed" })
        } else {
          res.json({ err: "Error in listing" })
        }
      } else {
        const unlist = await Coupon.findOneAndUpdate(
          { _id: id },
          { $set: { status: 1 } },
          { new: 0 }
        )
        if (unlist !== null) {
          res.json({ unlisted: "Coupon is unlisted" })
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
  loadCoupon,
  loadAddCoupon,
  addCoupon,
  listUnlistCoupon
}