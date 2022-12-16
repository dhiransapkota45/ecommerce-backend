const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  // gender:{
  //     type:String,
  //     required:true,
  //     enum:["male", "female", "other"]
  // },
  color: [{
    type: String,
    required: true,
    enum: ["green", "yellow", "red", "blue"],
  }],
  stock:{
    type:Number,
    required:true
  },
  size: [{
    type: String,
    required: true,
    enum: ["s", "m", "l", "xl", "xxl"],
  }],
  agegroup: {
    type: String,
    required: true,
    enum: ["men", "women", "children"],
  },
  category: {
    type: String,
    required: true,
    enum: ["T-Shirt", "Jacket", "Shirt", "Jeans", "other"],
  },
  description: {
    type: String,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usermodel",
      },
      review: String,
    },
  ],
});

module.exports = new mongoose.model("productmodel", productSchema);
