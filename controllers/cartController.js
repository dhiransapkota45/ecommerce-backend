const usermodel = require("../models/userModel");
const productmodel = require("../models/productModel");

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

class cartController {
  async addtocart(req, res) {
    // console.log("reached here");
    try {
      console.log(req.body);
      // console.log(req.user, "hello");
      const { productid } = req.params;
      const { user } = req;
      // console.log(user);
      const { color, size, quantity, stock } = req.body;
      if (
        color === null ||
        size === null ||
        quantity === null ||
        stock === null ||
        user === null ||
        productid === null
      ) {
        return res
          .status(400)
          .json({ success: false, msg: "required field not present" });
      }

      const finduser = await usermodel.findById(user);
      if (finduser === null) {
        return res
          .status(400)
          .json({ success: false, msg: "user does not exists" });
      }
      // console.log(finduser);
      const findproduct = await productmodel.findById(productid);
      if (findproduct === null) {
        return res
          .status(400)
          .json({ successs: false, msg: "product does not exists" });
      }

      const checkincart = await usermodel.find({
        $and: [{ "cartItems.product": productid }, { _id: user }],
      });
      console.log(checkincart);

      let bool = false;
      const cartupdatechecker = finduser.cartItems.map((data) => {
        const { color, size, quantity } = data;
        if (
          color === req.body.color &&
          size === req.body.size &&
          quantity === req.body.quantity
        ) {
          bool = true;
        } else {
          bool = false;
        }
      });

      console.log(bool);
      if (checkincart.length > 0) {
        if (bool) {
          return res
            .status(400)
            .json({ success: false, msg: "product is already in cart" });
        } else {
          console.log("it was here");
          const updatedata = await usermodel.findOneAndUpdate(
            {
              _id: req.user,
              "cartItems.product": productid,
            },
            {
              $set: { "cartItems.$": { ...req.body, product: productid } },
            }
          );
          console.log(updatedata);
          bool = false;
          return res
            .status(200)
            .json({ success: true, msg: "item updated successfully" });
        }
      }

      const addtocart = await usermodel.findByIdAndUpdate(
        user,
        {
          $push: { cartItems: { color, size, quantity, product: productid } },
        },
        { new: true }
      );

      return res
        .status(200)
        .json({ success: true, msg: "item added to cart successfully" });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteproductcart(req, res) {
    try {
      const userid = req.user;
      const finduser = await usermodel.findById(userid);
      if (finduser === null) {
        return res
          .status(400)
          .json({ success: false, msg: "user doesnot exists" });
      }

      const findproduct = await productmodel.findById(req.params.productid);
      if (findproduct === null) {
        return res
          .status(400)
          .json({ success: false, msg: "product does not exists" });
      }

      const deleteCartProduct = await usermodel.findByIdAndUpdate(userid, {
        $pull: {
          cartItems: { product: req.params.productid },
        },
      });

      if (deleteCartProduct === null) {
        return res
          .status(400)
          .json({ success: false, msg: "product is not in user's cart" });
      }
      return res
        .status(200)
        .json({ success: true, msg: "Product removed from cart successfully" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  // async checkout(req, res) {
  //   try {
  //     console.log(req.body);
  //     const line_items = req.body.cartdetails.map((cart) => {
  //       console.log(cart);
  //       return {
  //         price_data: {
  //           currency: "usd",
  //           product_data: {
  //             name: cart.productdetails.name,
  //           },
  //           unit_amount: cart.productdetails.price * 100,
  //         },
  //         quantity: cart.cartItems.quantity,
  //       };
  //     });

  //     console.log(line_items);

  //     const session = await stripe.checkout.sessions.create({
  //       payment_method_types: ["card"],
  //       line_items: line_items,
  //       mode: "payment",
  //       success_url: `http://localhost:3000/success`,
  //       cancel_url: `http://localhost:3000/cancel`,
  //     });

  //     return res.status(200).json({ url: session.url });
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }
  // }

  async pay(req, res) {
    const { amount, id } = req.body;
    console.log(id);
    try {
      const payment = await stripe.paymentIntents.create({
        amount,
        currency: "USD",
        description: "Spatula company",
        payment_method: id,
        confirm: true,
      });

      const cartdetails = await usermodel.findById(req.user);
      console.log(cartdetails);
      const cartItems = cartdetails.cartItems;
      const productids = cartItems.map((cartitem) => {
        return { productid: cartitem.product, quantity: cartitem.quantity };
      });

      productids.map(async (product) => {
        const product1 = await productmodel.findById(product.productid);
        const data = await productmodel.findByIdAndUpdate(product.productid, {
          stock: product1.stock - product.quantity,
        });
      });

      await usermodel.findByIdAndUpdate(req.user, { cartItems: [] });

      return res.json({ message: "payment successful", success: true });
    } catch (error) {
      console.log("Error", error);
      return res.json({ message: "payment failed", success: false });
    }
  }
}

module.exports = cartController;
