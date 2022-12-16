const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const cartControllerInstance = new cartController();
const fetchuser = require("../middlewares/token");

router.put(
  "/addtocart/:productid",
  fetchuser,
  cartControllerInstance.addtocart
);

router.put(
  "/deletecart/:productid",
  fetchuser,
  cartControllerInstance.deleteproductcart
);

// router.post("/checkout", fetchuser, cartControllerInstance.checkout);

router.post("/pay", fetchuser, cartControllerInstance.pay);


module.exports = router;
