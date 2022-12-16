const jwt = require("jsonwebtoken");
const usermodel = require("../models/userModel");
const mongoose = require("mongoose");
const verifyRefresh = require("../utils/verifyRefresh");

class userController {
  async signup(req, res) {
    try {
      const { checkbox } = req.body;
      const checkemail = await usermodel.find({ email: req.body.email });
      if (checkemail.length > 0) {
        return res
          .status(400)
          .json({ success: false, msg: "email already exists" });
      }
      const userdata = await usermodel.create(req.body);

      const user = { user: userdata._id };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRECT, {
        expiresIn: "10m",
      });
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRECT, {
        expiresIn: "1d",
      });
      return res
        .status(200)
        .json({
          success: true,
          authToken: accessToken,
          checkbox,
          refreshToken,
        });
    } catch (error) {
      return res.status(400).json({ success: false, msg: "error occured" });
    }
  }

  async login(req, res) {
    try {
      const { checkbox } = req.body;
      const checkemail = await usermodel.find({ email: req.body.email });
      //   email check
      if (checkemail.length === 0) {
        return res
          .status(400)
          .json({ success: false, msg: "email doesnot exists" });
      }

      //   password match
      if (!(checkemail[0].password === req.body.password)) {
        return res
          .status(400)
          .json({ success: false, msg: "password doesnot match" });
      }

      const user = { user: checkemail[0]._id };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRECT, {
        expiresIn: "10m",
      });
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRECT, {
        expiresIn: "1d",
      });

      return res.status(200).json({
        success: true,
        authToken: accessToken,
        checkbox,
        refreshToken,
      });
    } catch (error) {
      return res.send("error occured");
    }
  }

  async usercartproduct(req, res) {
    try {
      const { user } = req;

      const pipeline = [
        { $match: { _id: mongoose.Types.ObjectId(user) } },
        { $unwind: "$cartItems" },
        {
          $lookup: {
            from: "productmodels",
            localField: "cartItems.product",
            foreignField: "_id",
            as: "productdetails",
          },
        },
        { $unwind: "$productdetails" },
        {
          $project: {
            cartItems: 1,
            "productdetails.image": 1,
            "productdetails.name": 1,
            "productdetails.price": 1,
            "productdetails.stock": 1,
            "productdetails._id": 1,
          },
        },
        { $project: { "cartItems.product": 0 } },
      ];
      const response = await usermodel.aggregate(pipeline);
      // console.log(response);
      return res.send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, msg: "error occured!" });
    }
  }

  async verifyRefreshToken(req, res) {
    const { refreshToken } = req.body;
    const isvalid = verifyRefresh(refreshToken);
    if (!isvalid) {
      return res.status(401).json({
        success: false,
        error: "Refresh token expired, please log in agaiin",
      });
    }

    const accessToken = jwt.sign(
      { user: isvalid.user },
      process.env.ACCESS_TOKEN_SECRECT,
      { expiresIn: "2m" }
    );

    return res.status(200).json({ success: true, accessToken });
  }
}

module.exports = userController;
