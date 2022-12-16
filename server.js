const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const user = require("./routes/userRoute");
const product = require("./routes/productRoute");
const cart = require("./routes/cartRoute");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)


app.use(cors());
app.use(express.json());
app.use("/", user);
app.use("/", product);
app.use("/", cart);


// app.get("/hello", (req, res)=>{
//   console.log(req.query);
// })

app.listen(process.env.PORT, () => {
  mongoose
    .connect("mongodb://localhost:27017/ecommerce")
    .then(() => {
      console.log("connected to the database");
    })
    .catch((error) => {
      console.log("error occured at database");
    });
  console.log("listening at port ", process.env.PORT);
});
