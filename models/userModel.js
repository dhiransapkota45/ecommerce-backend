const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productmodel",
        required: true,
      },
      color: {
        type: String,
        required: true,
        enum: ["green", "yellow", "red", "blue"],
      },
      stock: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
        enum: ["s", "m", "l", "xl", "xxl"],
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("usermodel", userSchema);
