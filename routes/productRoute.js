const express = require("express");
const router = express.Router();
const fetchuser = require("../middlewares/token");

const productController = require("../controllers/productController");

const productControllerInstance = new productController();
router.post("/addproduct", productControllerInstance.addproduct);
router.post("/allproduct", productControllerInstance.getproduct);
router.get("/item/:id", productControllerInstance.item);

router.post(
  "/wishlistproducts",
  fetchuser,
  productControllerInstance.wishlistProducts
);

module.exports = router;
