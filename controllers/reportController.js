const User = require("../models/userSchema");
const Order = require("../models/orderSchema");
const excelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const loadReport = async (req, res) => {
  try {
    const proSold = await Order.aggregate([
      { $match: { payment_status: "Paid" } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $limit: 8 },
    ]);
    const totPro = await Order.aggregate([
      { $match: { payment_status: "Paid" } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $count: "proCount" },
    ]);
    // console.log(totPro[0].proCount);
    const totalProducts = await Order.aggregate([
      { $unwind: "$products" },
      { $group: { _id: null, quantity: { $sum: "$products.qty" } } },
    ]);
    const totalUsers = await User.aggregate([
      { $match: { type: "user" } },
      { $count: "users" },
    ]);
    const totalOrders = await Order.aggregate([
      { $match: { payment_status: "Paid" } },
      { $count: "orders" },
    ]);
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);
    // console.log(totalRevenue)
    res.render("admin/salesReport", {
      prosold: proSold,
      totalProducts: totalProducts.length > 0 ? totalProducts[0].quantity : 0,
      totalUsers: totalUsers.length > 0 ? totalUsers[0].users : 0,
      totalOrders: totalOrders.length > 0 ? totalOrders[0].orders : 0,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totPro: totPro.length > 0 ? totPro[0].proCount : 0,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const dailyProducts = async (req, res) => {
  try {
    const { day, month, year } = req.query;
    let page = req.query.page ? req.query.page : 1;

    let day1 = day ? parseInt(day) : null;
    let month1 = month ? parseInt(month) - 1 : null;
    let year1 = year ? parseInt(year) : null;
    let proSold;
    let proSoldCount;
    if (day1 === null || month1 === null || year1 === null) {
      proSold = await Order.aggregate([
        { $match: { payment_status: "Paid" } },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
        { $skip: (page - 1) * 8 },
        { $limit: 8 },
      ]);
      proSoldCount = await Order.aggregate([
        { $match: { payment_status: "Paid" } },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
        { $count: "procount" },
      ]);
    } else {
      console.log(day1, month1, year1);
      const date = new Date(year1, month1, day1 + 1);
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      console.log(start, end);

      proSold = await Order.aggregate([
        { $match: { payment_status: "Paid", date: { $gte: start, $lt: end } } },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
        { $skip: (page - 1) * 8 },
        { $limit: 8 },
      ]);
      proSoldCount = await Order.aggregate([
        { $match: { payment_status: "Paid", date: { $gte: start, $lt: end } } },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
        { $count: "procount" },
      ]);

      // console.log(proSold)
    }
    console.log(proSoldCount);

    if (proSold) {
      res.json({
        proSold,
        procount: proSoldCount.length > 0 ? proSoldCount[0].procount : 0,
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const weeklyProducts = async (req, res) => {
  try {
    const { week, month, year } = req.query;
    let page = req.query.page ? req.query.page : 1;
    console.log(week, month, year);
    let week1 = week ? parseInt(week) : null;
    let month1 = month ? parseInt(month) : null;
    let year1 = year ? parseInt(year) : null;

    function getWeekDetails(week) {
      const firstday = new Date(year1, month1, 1);
      firstday.setUTCHours(0, 0, 0, 0);
      const startDay = new Date(firstday);
      startDay.setDate((week - 1) * 7 + 1);
      const endDay = new Date(startDay);
      if (week1 === 4) {
        if (
          month1 == 0 ||
          month1 == 2 ||
          month1 == 4 ||
          month1 == 6 ||
          month1 == 7 ||
          month1 == 9 ||
          month1 == 11
        ) {
          endDay.setDate(startDay.getDate() + 9);
        } else if (month1 == 3 || month1 == 5 || month1 == 8 || month1 == 10) {
          endDay.setDate(startDay.getDate() + 8);
        } else {
          if (year1 % 100 !== 0 && year1 % 4 == 0) {
            endDay.setDate(startDay.getDate() + 7);
          } else {
            endDay.setDate(startDay.getDate() + 6);
          }
        }
      } else {
        endDay.setDate(startDay.getDate() + 7);
      }

      return { startDay, endDay };
    }
    const { startDay, endDay } = getWeekDetails(week1);
    console.log(startDay, endDay);
    proSold = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $skip: (page - 1) * 8 },
      { $limit: 8 },
    ]);
    proSoldCount = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $count: "procount" },
    ]);
    console.log(proSold);
    console.log(proSoldCount);
    if (proSold.length > 0) {
      res.json({
        proSold: proSold,
        procount: proSoldCount ? proSoldCount[0].procount : 8,
      });
    } else {
      res.json({ proerr: "NO PRODUCTS AVAILABLE" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const monthlyProducts = async (req, res) => {
  try {
    const { month, year } = req.query;
    console.log(month, year);
    let page = req.query.page ? req.query.page : 1;
    let month1 = month ? parseInt(month) - 1 : null;
    let year1 = year ? parseInt(year) : null;
    console.log("pg" + page);
    function getMonthDetails(month1) {
      const date = new Date(year1, month1 + 1);
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
      const startDay = new Date(date);
      let endDay = new Date(startDay);
      if (
        month1 == 0 ||
        month1 == 2 ||
        month1 == 4 ||
        month1 == 6 ||
        month1 == 7 ||
        month1 == 9 ||
        month1 == 11
      ) {
        endDay.setDate(31);
      } else if (month1 == 3 || month1 == 5 || month1 == 8 || month1 == 10) {
        endDay.setDate(30);
      } else {
        if (year1 % 100 !== 0 && year1 % 4 == 0) {
          endDay.setDate(29);
        } else {
          endDay.setDate(28);
        }
      }

      console.log(startDay);
      console.log(endDay);
      return { startDay, endDay };
    }
    const { startDay, endDay } = getMonthDetails(month1);
    proSold = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $skip: (page - 1) * 8 },
      { $limit: 8 },
    ]);
    proSoldCount = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $count: "procount" },
    ]);
    console.log(proSold);
    console.log(proSoldCount);
    if (proSold.length > 0) {
      res.json({
        proSold: proSold,
        procount: proSoldCount ? proSoldCount[0].procount : 8,
      });
    } else {
      res.json({ proerr: "NO PRODUCTS AVAILABLE" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const yearlyProducts = async (req, res) => {
  try {
    const { year } = req.query;
    let page = req.query.page ? req.query.page : 1;
    let year1 = year ? parseInt(year) : null;
    console.log(year1);
    function getYearData(year1) {
      const date = new Date(year1, 1);
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
      let startDay = date;
      let endDay = new Date(startDay);
      endDay.setFullYear(startDay.getFullYear() + 1);
      console.log(startDay);
      console.log(endDay);
      return { startDay, endDay };
    }
    const { startDay, endDay } = getYearData(year1);
    proSold = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $skip: (page - 1) * 8 },
      { $limit: 8 },
    ]);
    proSoldCount = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $count: "procount" },
    ]);
    console.log(proSold);
    console.log(proSoldCount);
    if (proSold.length > 0) {
      res.json({
        proSold: proSold,
        procount: proSoldCount ? proSoldCount[0].procount : 8,
      });
    } else {
      res.json({ proerr: "NO PRODUCTS AVAILABLE" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const rangeProducts = async (req, res) => {
  try {
    const { day1, day2, month1, month2, year1, year2 } = req.query;

    let page = req.query.page ? parseInt(req.query.page) : 1;
    console.log(day1, day2, month1, month2, year1, year2);
    let firstday = parseInt(day1);
    let firstmonth = parseInt(month1);
    let firstyear = parseInt(year1);
    let secondday = parseInt(day2);
    let secondmonth = parseInt(month2);
    let secondyear = parseInt(year2);
    const startdate = new Date(firstyear, firstmonth);
    startdate.setUTCDate(firstday);
    startdate.setUTCHours(0, 0, 0, 0);

    const enddate = new Date(secondyear, secondmonth);
    enddate.setUTCDate(secondday);
    enddate.setUTCHours(0, 0, 0, 0);
    proSold = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startdate, $lt: enddate },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $skip: (page - 1) * 8 },
      { $limit: 8 },
    ]);
    proSoldCount = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startdate, $lt: enddate },
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userdetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "prodetails",
        },
      },
      { $sort: { date: -1 } },
      { $count: "procount" },
    ]);
    console.log(proSold);
    console.log(proSoldCount);
    if (proSold.length > 0) {
      res.json({
        proSold: proSold,
        procount: proSoldCount ? proSoldCount[0].procount : 8,
      });
    } else {
      res.json({ proerr: "NO PRODUCTS AVAILABLE" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const dailyTurnover = async (req, res) => {
  try {
    const { day, month, year } = req.query;
    let day1 = day ? parseInt(day) : null;
    let month1 = month ? parseInt(month) - 1 : null;
    let year1 = year ? parseInt(year) : null;
    console.log(day1, month1, year1);
    const date = new Date(year1, month1, day1 + 1);
    const start = new Date(date);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    console.log(start, end);
    const totalProducts = await Order.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $unwind: "$products" },
      { $group: { _id: null, quantity: { $sum: "$products.qty" } } },
    ]);
    const totalUsers = await User.aggregate([
      { $match: { type: "user", date: { $gte: start, $lt: end } } },
      { $count: "users" },
    ]);
    const totalOrders = await Order.aggregate([
      { $match: { payment_status: "Paid", date: { $gte: start, $lt: end } } },
      { $count: "orders" },
    ]);
    const totalRevenue = await Order.aggregate([
      { $match: { date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);
    res.json({
      totalOrders: totalOrders.length > 0 ? totalOrders[0].orders : 0,
      totalProducts: totalProducts.length > 0 ? totalProducts[0].quantity : 0,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalUsers: totalUsers.length > 0 ? totalUsers[0].users : 0,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const weeklyTurnover = async (req, res) => {
  try {
    const { week, month, year } = req.query;
    let week1 = week ? parseInt(week) : null;
    let month1 = month ? parseInt(month) : null;
    let year1 = year ? parseInt(year) : null;
    console.log(week1, month1, year1);
    function getWeekDetails(week) {
      const firstday = new Date(year1, month1, 1);
      firstday.setUTCHours(0, 0, 0, 0);
      const startDay = new Date(firstday);
      startDay.setDate((week - 1) * 7 + 1);
      const endDay = new Date(startDay);
      let month2 = month1 - 1;
      if (week1 === 4) {
        if (
          month2 == 0 ||
          month2 == 2 ||
          month2 == 4 ||
          month2 == 6 ||
          month2 == 7 ||
          month2 == 9 ||
          month2 == 11
        ) {
          endDay.setDate(startDay.getDate() + 9);
        } else if (month2 == 3 || month2 == 5 || month2 == 8 || month2 == 10) {
          endDay.setDate(startDay.getDate() + 8);
        } else {
          if (year1 % 100 !== 0 && year1 % 4 == 0) {
            endDay.setDate(startDay.getDate() + 7);
          } else {
            endDay.setDate(startDay.getDate() + 6);
          }
        }
      } else {
        endDay.setDate(startDay.getDate() + 7);
      }
      return { startDay, endDay };
    }
    const { startDay, endDay } = getWeekDetails(week1);
    const totalProducts = await Order.aggregate([
      { $match: { date: { $gte: startDay, $lt: endDay } } },
      { $unwind: "$products" },
      { $group: { _id: null, quantity: { $sum: "$products.qty" } } },
    ]);
    const totalUsers = await User.aggregate([
      { $match: { type: "user", date: { $gte: startDay, $lt: endDay } } },
      { $count: "users" },
    ]);
    const totalOrders = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $count: "orders" },
    ]);
    const totalRevenue = await Order.aggregate([
      { $match: { date: { $gte: startDay, $lt: endDay } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);
    res.json({
      totalOrders: totalOrders.length > 0 ? totalOrders[0].orders : 0,
      totalProducts: totalProducts.length > 0 ? totalProducts[0].quantity : 0,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalUsers: totalUsers.length > 0 ? totalUsers[0].users : 0,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const monthlyTurnover = async (req, res) => {
  try {
    const { month, year } = req.query;
    let month1 = month ? parseInt(month) - 1 : null;
    let year1 = year ? parseInt(year) : null;
    function getMonthDetails(month1) {
      const date = new Date(year1, month1 + 1);
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
      const startDay = new Date(date);
      let endDay = new Date(startDay);
      if (
        month1 == 0 ||
        month1 == 2 ||
        month1 == 4 ||
        month1 == 6 ||
        month1 == 7 ||
        month1 == 9 ||
        month1 == 11
      ) {
        endDay.setDate(31);
      } else if (month1 == 3 || month1 == 5 || month1 == 8 || month1 == 10) {
        endDay.setDate(30);
      } else {
        if (year1 % 100 !== 0 && year1 % 4 == 0) {
          endDay.setDate(29);
        } else {
          endDay.setDate(28);
        }
      }

      return { startDay, endDay };
    }
    const { startDay, endDay } = getMonthDetails(month1);
    const totalProducts = await Order.aggregate([
      { $match: { date: { $gte: startDay, $lt: endDay } } },
      { $unwind: "$products" },
      { $group: { _id: null, quantity: { $sum: "$products.qty" } } },
    ]);
    const totalUsers = await User.aggregate([
      { $match: { type: "user", date: { $gte: startDay, $lt: endDay } } },
      { $count: "users" },
    ]);
    const totalOrders = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $count: "orders" },
    ]);
    const totalRevenue = await Order.aggregate([
      { $match: { date: { $gte: startDay, $lt: endDay } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);
    res.json({
      totalOrders: totalOrders.length > 0 ? totalOrders[0].orders : 0,
      totalProducts: totalProducts.length > 0 ? totalProducts[0].quantity : 0,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalUsers: totalUsers.length > 0 ? totalUsers[0].users : 0,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const yearlyTurnover = async (req, res) => {
  try {
    const { year } = req.query;
    let year1 = year ? parseInt(year) : null;
    function getYearData(year1) {
      const date = new Date(year1, 1);
      date.setUTCDate(1);
      date.setUTCHours(0, 0, 0, 0);
      let startDay = date;
      let endDay = new Date(startDay);
      endDay.setFullYear(startDay.getFullYear() + 1);

      return { startDay, endDay };
    }
    const { startDay, endDay } = getYearData(year1);
    const totalProducts = await Order.aggregate([
      { $match: { date: { $gte: startDay, $lt: endDay } } },
      { $unwind: "$products" },
      { $group: { _id: null, quantity: { $sum: "$products.qty" } } },
    ]);
    const totalUsers = await User.aggregate([
      { $match: { type: "user", date: { $gte: startDay, $lt: endDay } } },
      { $count: "users" },
    ]);
    const totalOrders = await Order.aggregate([
      {
        $match: {
          payment_status: "Paid",
          date: { $gte: startDay, $lt: endDay },
        },
      },
      { $count: "orders" },
    ]);
    const totalRevenue = await Order.aggregate([
      { $match: { date: { $gte: startDay, $lt: endDay } } },
      { $group: { _id: null, total: { $sum: "$total_amount" } } },
    ]);
    res.json({
      totalOrders: totalOrders.length > 0 ? totalOrders[0].orders : 0,
      totalProducts: totalProducts.length > 0 ? totalProducts[0].quantity : 0,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      totalUsers: totalUsers.length > 0 ? totalUsers[0].users : 0,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const getExcelData = async (req, res) => {
  try {
    console.log("excel");
    const {
      day,
      month,
      year,
      week,
      firstday,
      firstmonth,
      firstyear,
      secondday,
      secondmonth,
      secondyear,
    } = req.query;
    console.log(
      day,
      month,
      year,
      week,
      firstday,
      firstmonth,
      firstyear,
      secondday,
      secondmonth,
      secondyear
    );
    const day1 = day ? parseInt(day) : undefined;
    const week1 = week ? parseInt(week) : undefined;
    const month1 = month ? parseInt(month) : undefined;
    const year1 = year ? parseInt(year) : undefined;
    const firstday1 = firstday ? parseInt(firstday) : undefined;
    const firstmonth1 = firstmonth ? parseInt(firstmonth) : undefined;
    const firstyear1 = firstyear ? parseInt(firstyear) : undefined;
    const secondday1 = secondday ? parseInt(secondday) : undefined;
    const secondmonth1 = secondmonth ? parseInt(secondmonth) : undefined;
    const secondyear1 = secondyear ? parseInt(secondyear) : undefined;

    let proSold;
    if (
      day !== undefined &&
      month != undefined &&
      year != undefined &&
      firstday1 == undefined &&
      firstmonth1 == undefined &&
      firstyear1 == undefined &&
      secondday1 == undefined &&
      secondmonth1 == undefined &&
      secondyear1 == undefined
    ) {
      const date = new Date(year1, month1 - 1, day1 + 1);
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      console.log(start, end);
      proSold = await Order.aggregate([
        { $match: { payment_status: "Paid", date: { $gte: start, $lt: end } } },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    } else if (
      week !== undefined &&
      month != undefined &&
      year != undefined &&
      day === undefined &&
      firstday1 == undefined &&
      firstmonth1 == undefined &&
      firstyear1 == undefined &&
      secondday1 == undefined &&
      secondmonth1 == undefined &&
      secondyear1 == undefined
    ) {
      function getWeekDetails(week) {
        const firstday = new Date(year1, month1, 1);
        firstday.setUTCHours(0, 0, 0, 0);
        const startDay = new Date(firstday);
        startDay.setDate((week - 1) * 7 + 1);
        const endDay = new Date(startDay);
        if (week1 === 4) {
          if (
            month1 == 0 ||
            month1 == 2 ||
            month1 == 4 ||
            month1 == 6 ||
            month1 == 7 ||
            month1 == 9 ||
            month1 == 11
          ) {
            endDay.setDate(startDay.getDate() + 9);
          } else if (
            month1 == 3 ||
            month1 == 5 ||
            month1 == 8 ||
            month1 == 10
          ) {
            endDay.setDate(startDay.getDate() + 8);
          } else {
            if (year1 % 100 !== 0 && year1 % 4 == 0) {
              endDay.setDate(startDay.getDate() + 7);
            } else {
              endDay.setDate(startDay.getDate() + 6);
            }
          }
        } else {
          endDay.setDate(startDay.getDate() + 7);
        }

        return { startDay, endDay };
      }
      const { startDay, endDay } = getWeekDetails(week1);
      console.log(startDay, endDay);
      proSold = await Order.aggregate([
        {
          $match: {
            payment_status: "Paid",
            date: { $gte: startDay, $lt: endDay },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    } else if (
      month != undefined &&
      year != undefined &&
      week === undefined &&
      day === undefined &&
      firstday1 == undefined &&
      firstmonth1 == undefined &&
      firstyear1 == undefined &&
      secondday1 == undefined &&
      secondmonth1 == undefined &&
      secondyear1 == undefined
    ) {
      function getMonthDetails(month1) {
        const date = new Date(year1, month1);
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        const startDay = new Date(date);
        let endDay = new Date(startDay);
        if (
          month1 == 0 ||
          month1 == 2 ||
          month1 == 4 ||
          month1 == 6 ||
          month1 == 7 ||
          month1 == 9 ||
          month1 == 11
        ) {
          endDay.setDate(31);
        } else if (month1 == 3 || month1 == 5 || month1 == 8 || month1 == 10) {
          endDay.setDate(30);
        } else {
          if (year1 % 100 !== 0 && year1 % 4 == 0) {
            endDay.setDate(29);
          } else {
            endDay.setDate(28);
          }
        }

        console.log(startDay);
        console.log(endDay);
        return { startDay, endDay };
      }
      const { startDay, endDay } = getMonthDetails(month1);

      proSold = await Order.aggregate([
        {
          $match: {
            payment_status: "Paid",
            date: { $gte: startDay, $lt: endDay },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    } else if (
      year != undefined &&
      week === undefined &&
      day === undefined &&
      month == undefined &&
      firstday1 == undefined &&
      firstmonth1 == undefined &&
      firstyear1 == undefined &&
      secondday1 == undefined &&
      secondmonth1 == undefined &&
      secondyear1 == undefined
    ) {
      function getYearData(year1) {
        const date = new Date(year1, 1);
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        let startDay = date;
        let endDay = new Date(startDay);
        endDay.setFullYear(startDay.getFullYear() + 1);
        console.log(startDay);
        console.log(endDay);
        return { startDay, endDay };
      }
      const { startDay, endDay } = getYearData(year1);
      proSold = await Order.aggregate([
        {
          $match: {
            payment_status: "Paid",
            date: { $gte: startDay, $lt: endDay },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    } else if (
      day == undefined &&
      month == undefined &&
      year == undefined &&
      week == undefined &&
      firstday1 != undefined &&
      firstmonth1 != undefined &&
      firstyear1 != undefined &&
      secondday1 != undefined &&
      secondmonth1 != undefined &&
      secondyear1 != undefined
    ) {
      const startdate = new Date(firstyear1, firstmonth1);
      startdate.setUTCDate(firstday1);
      startdate.setUTCHours(0, 0, 0, 0);

      const enddate = new Date(secondyear1, secondmonth1);
      enddate.setUTCDate(secondday1);
      enddate.setUTCHours(0, 0, 0, 0);
      proSold = await Order.aggregate([
        {
          $match: {
            payment_status: "Paid",
            date: { $gte: startdate, $lt: enddate },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
      //  console.log(proSold)
    }
    // console.log(proSold)
    const workbook = new excelJS.Workbook();
    const workSheet = workbook.addWorksheet("Sales Report");
    workSheet.columns = [
      { header: "S.no", key: "sno", width: 15 },
      { header: "Date Purchased", key: "date", width: 15 },
      { header: "Customer Name", key: "name", width: 25 },
      { header: "Product Name", key: "pname", width: 25 },
      { header: "Quantity", key: "qty", width: 15 },
      { header: "Price", key: "price", width: 15 },
      { header: "Order Amount", key: "amount", width: 15 },
      { header: "Payment Method", key: "method", width: 20 },
    ];

    let count = 1;
    let reporter = [];
    proSold.forEach((data) => {
      let xldata = {
        sno: count,
        date:
          data.date.toString().split(" ")[1] +
          " " +
          data.date.toString().split(" ")[2] +
          " " +
          data.date.toString().split(" ")[3],
        name:
          data.userdetails[0].firstname + " " + data.userdetails[0].lastname,
        pname: data.prodetails[0].productname,
        qty: data.products.qty,
        price: data.prodetails[0].price,
        amount: data.total_amount,
        method: data.payment_method,
      };
      reporter.push(xldata);
      count++;
    });
    // console.log(reporter)

    reporter.forEach((rep) => {
      workSheet.addRow(rep);
    });
    workSheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=salesreport.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error.message);
  }
};

const getPdfData = async (req, res) => {
  try {
    console.log("pdf");
    const {
      day,
      month,
      year,
      week,
      firstday,
      firstmonth,
      firstyear,
      secondday,
      secondmonth,
      secondyear,
    } = req.query;
    console.log(day, month, year, week);
    const day1 = day ? parseInt(day) : undefined;
    const week1 = week ? parseInt(week) : undefined;
    const month1 = month ? parseInt(month) : undefined;
    const year1 = year ? parseInt(year) : undefined;
    const firstday1 = firstday ? parseInt(firstday) : undefined;
    const firstmonth1 = firstmonth ? parseInt(firstmonth) : undefined;
    const firstyear1 = firstyear ? parseInt(firstyear) : undefined;
    const secondday1 = secondday ? parseInt(secondday) : undefined;
    const secondmonth1 = secondmonth ? parseInt(secondmonth) : undefined;
    const secondyear1 = secondyear ? parseInt(secondyear) : undefined;

    let proSold;
    if (
      day !== undefined &&
      month != undefined &&
      year != undefined &&
      firstday1 == undefined &&
      firstmonth1 == undefined &&
      firstyear1 == undefined &&
      secondday1 == undefined &&
      secondmonth1 == undefined &&
      secondyear1 == undefined
    ) {
      const date = new Date(year1, month1 - 1, day1 + 1);
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      console.log(start, end);
      proSold = await Order.aggregate([
        { $match: { payment_status: "Paid", date: { $gte: start, $lt: end } } },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    } else if (
      week !== undefined &&
      month != undefined &&
      year != undefined &&
      firstday1 == undefined &&
      firstmonth1 == undefined &&
      firstyear1 == undefined &&
      secondday1 == undefined &&
      secondmonth1 == undefined &&
      secondyear1 == undefined
    ) {
      function getWeekDetails(week) {
        const firstday = new Date(year1, month1, 1);
        firstday.setUTCHours(0, 0, 0, 0);
        const startDay = new Date(firstday);
        startDay.setDate((week - 1) * 7 + 1);
        const endDay = new Date(startDay);
        if (week1 === 4) {
          if (
            month1 == 0 ||
            month1 == 2 ||
            month1 == 4 ||
            month1 == 6 ||
            month1 == 7 ||
            month1 == 9 ||
            month1 == 11
          ) {
            endDay.setDate(startDay.getDate() + 9);
          } else if (
            month1 == 3 ||
            month1 == 5 ||
            month1 == 8 ||
            month1 == 10
          ) {
            endDay.setDate(startDay.getDate() + 8);
          } else {
            if (year1 % 100 !== 0 && year1 % 4 == 0) {
              endDay.setDate(startDay.getDate() + 7);
            } else {
              endDay.setDate(startDay.getDate() + 6);
            }
          }
        } else {
          endDay.setDate(startDay.getDate() + 7);
        }

        return { startDay, endDay };
      }
      const { startDay, endDay } = getWeekDetails(week1);
      console.log(startDay, endDay);
      proSold = await Order.aggregate([
        {
          $match: {
            payment_status: "Paid",
            date: { $gte: startDay, $lt: endDay },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    } else if (
      month != undefined &&
      year != undefined &&
      week === undefined &&
      day === undefined &&
      firstday1 == undefined &&
      firstmonth1 == undefined &&
      firstyear1 == undefined &&
      secondday1 == undefined &&
      secondmonth1 == undefined &&
      secondyear1 == undefined
    ) {
      function getMonthDetails(month1) {
        const date = new Date(year1, month1);
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        const startDay = new Date(date);
        let endDay = new Date(startDay);
        if (
          month1 == 0 ||
          month1 == 2 ||
          month1 == 4 ||
          month1 == 6 ||
          month1 == 7 ||
          month1 == 9 ||
          month1 == 11
        ) {
          endDay.setDate(31);
        } else if (month1 == 3 || month1 == 5 || month1 == 8 || month1 == 10) {
          endDay.setDate(30);
        } else {
          if (year1 % 100 !== 0 && year1 % 4 == 0) {
            endDay.setDate(29);
          } else {
            endDay.setDate(28);
          }
        }

        console.log(startDay);
        console.log(endDay);
        return { startDay, endDay };
      }
      const { startDay, endDay } = getMonthDetails(month1);

      proSold = await Order.aggregate([
        {
          $match: {
            payment_status: "Paid",
            date: { $gte: startDay, $lt: endDay },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    } else if (
      year != undefined &&
      week === undefined &&
      day === undefined &&
      month == undefined &&
      firstday1 == undefined &&
      firstmonth1 == undefined &&
      firstyear1 == undefined &&
      secondday1 == undefined &&
      secondmonth1 == undefined &&
      secondyear1 == undefined
    ) {
      function getYearData(year1) {
        const date = new Date(year1, 1);
        date.setUTCDate(1);
        date.setUTCHours(0, 0, 0, 0);
        let startDay = date;
        let endDay = new Date(startDay);
        endDay.setFullYear(startDay.getFullYear() + 1);
        console.log(startDay);
        console.log(endDay);
        return { startDay, endDay };
      }
      const { startDay, endDay } = getYearData(year1);
      proSold = await Order.aggregate([
        {
          $match: {
            payment_status: "Paid",
            date: { $gte: startDay, $lt: endDay },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    } else if (
      day == undefined &&
      month == undefined &&
      year == undefined &&
      week == undefined &&
      firstday1 != undefined &&
      firstmonth1 != undefined &&
      firstyear1 != undefined &&
      secondday1 != undefined &&
      secondmonth1 != undefined &&
      secondyear1 != undefined
    ) {
      const startdate = new Date(firstyear1, firstmonth1);
      startdate.setUTCDate(firstday1);
      startdate.setUTCHours(0, 0, 0, 0);

      const enddate = new Date(secondyear1, secondmonth1);
      enddate.setUTCDate(secondday1);
      enddate.setUTCHours(0, 0, 0, 0);
      proSold = await Order.aggregate([
        {
          $match: {
            payment_status: "Paid",
            date: { $gte: startdate, $lt: enddate },
          },
        },
        { $unwind: "$products" },
        {
          $lookup: {
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "userdetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "products.product_id",
            foreignField: "_id",
            as: "prodetails",
          },
        },
        { $sort: { date: -1 } },
      ]);
    }
    // console.log(proSold)
    const doc = new PDFDocument();
    res.setHeader(
      "Content-disposition",
      "attachment; filename=salesreport.pdf"
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);
    doc.fontSize(20).text("Sales Report", { align: "center" }).moveDown();

    let count = 1;
    let yPos = 100;
    const colomn = 60;
    doc.font("Helvetica-Bold").fontSize(9);
    doc.text("Serial no.", 30, yPos);
    doc.text("Date ", 15 + colomn, yPos);
    doc.text("Customer ", 10 + colomn * 2, yPos);
    doc.text("Product Name", 10 + colomn * 3, yPos);
    doc.text("Quantity", 10 + colomn * 5.3, yPos);
    doc.text("Price", 10 + colomn * 6.2, yPos);
    doc.text("Total ", 10 + colomn * 7, yPos);
    doc.text("Payment Method", 10 + colomn * 7.7, yPos);
    proSold.forEach((data) => {
      yPos += 20;
      doc.font("Helvetica").fontSize(8);
      doc.text(count, 30, yPos);
      doc.text(
        data.date.toString().split(" ")[1] +
          " " +
          data.date.toString().split(" ")[2] +
          " " +
          data.date.toString().split(" ")[3],
        15 + colomn,
        yPos
      );
      doc.text(
        data.userdetails[0].firstname + " " + data.userdetails[0].lastname,
        10 + colomn * 2,
        yPos
      );
      doc.text(data.prodetails[0].productname, 10 + colomn * 3, yPos);
      doc.text(data.products.qty, 10 + colomn * 5.3, yPos);
      doc.text(data.prodetails[0].price, 10 + colomn * 6.2, yPos);
      doc.text(data.total_amount, 10 + colomn * 7, yPos);
      doc.text(data.payment_method, 10 + colomn * 7.7, yPos);

      count++;
      if (count % 30 === 0) {
        doc.addPage();
        yPos = 50;
      }
    });

    doc.end();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  loadReport,
  dailyProducts,
  weeklyProducts,
  monthlyProducts,
  yearlyProducts,
  dailyTurnover,
  weeklyTurnover,
  monthlyTurnover,
  yearlyTurnover,
  getExcelData,
  getPdfData,
  rangeProducts,
};