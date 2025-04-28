const dotenv = require("dotenv");
dotenv.config();
const Product = require("../models/Product");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// @desc    Show form to create a product
// @route   GET /api/products/new (frontend only)
// @access  Public

exports.showCreateForm = (req, res) => {
  res.render("products/create");
};

// @desc   Create new product
// @route   POST /products (frontend only)
// @access  Public
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, imageUrl } = req.body;
    //Create product in stripe
    const stripeProduct = await stripe.products.create({
      name,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    });
    //Create price in Stripe
    const stripePrice = await stripe.prices.create({
      product: stripeProduct.id,
      unit_amount: Math.round(price * 100),
      currency: "usd",
    });
    //Create a product in database
    const product = await Product.create({
      name,
      price,
      description,
      imageUrl,
      stripeProductId: stripeProduct.id,
      stripePriceId: stripePrice.id,
    });
    console.log(product);

    //Redirect  for frontend
    res.render("products/index");
  } catch (error) {
    res.status(500).render("error", {
      message: "Error creating product",
    });
  }
};

// @desc    Get all Products
// @route   GET/products (frontend only)
// @access  Public

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort("-createdAt");
    //Render for frontend
    res.render("products/index", {
      products,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error Loading products",
    });
  }
};

// @desc    Get a Product
// @route   GET/products/:id (frontend only)
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/show", {
      product,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error Loading products",
    });
  }
};
