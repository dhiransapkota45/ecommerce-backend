const productmodel = require("../models/productModel");
const product = require("../product");

class productController {
  async addproduct(req, res) {
    try {
      // console.log(product);
      const insertproducts = await productmodel.create(product);
      return res.json({ success: true, insertproducts });
    } catch (error) {
      console.log(error);
    }
  }

  // category agegroup size color
  async getproduct(req, res) {
    try {
      const { price } = req.body;
      // console.log("it was ", price);
      const data = req.body;
      delete data.price;
      const getproduct = await productmodel.find({
        ...data,
        price: { $lte: price },
      });

      return res.status(200).json({ product: getproduct, success: true });
    } catch (error) {
      return res.status(500).json({ success: false, error: "error occured" });
    }
  }

  async item(req, res) {
    try {
      const { id } = req.params;
      const item = await productmodel.findById(id);
      // console.log(item);
      return res.status(200).json({ success: true, item });
    } catch (error) {
      return res.status(500).json({ success: false, error: "error occured" });
    }
  }

  async wishlistProducts(req, res) {
    try {
      // console.log("hello", req.body, req.user);
      const data = await productmodel.find({ _id: req.body.products });
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
}

module.exports = productController;
