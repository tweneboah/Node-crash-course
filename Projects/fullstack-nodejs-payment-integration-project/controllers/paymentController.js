const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Customer = require("../models/Customer");
const Payment = require("../models/Payment");
const Product = require("../models/Product");

// @desc    Show checkout page for a product
// @route   GET /checkout/:productId (frontend only)
// @access  Public
exports.showCheckout = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    res.render("checkout", {
      product,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error Loading Checkout",
    });
  }
};

// @desc    Process checkout
// @route   POST /checkout/:productId (frontend only)
// @access  Public
exports.processCheckout = async (req, res) => {
  try {
    const { name, email } = req.body;
    const productId = req.params.productId;
    //Find or create customer
    let customer = await Customer.findOne({ email });
    if (!customer) {
      //Create a customer in stripe
      const stripeCustomer = await stripe.customers.create({
        name,
        email,
      });
      //Create customer in database
      customer = await Customer.create({
        name,
        email,
        stripeCustomerId: stripeCustomer.id,
      });
    }
    //Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).render("error", {
        message: "Product Not Found",
      });
    }
    //Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 200), //Stripe expects amount in cents
      currency: "usd",
      customer: customer.stripeCustomerId,
      description: `Payment for ${product.name}`,
      metadata: {
        customerId: customer._id.toString(),
        productId: product._id.toString(),
      },
    });
    //Create payment record in database
    const payment = await Payment.create({
      customer: customer._id,
      stripePaymentIntentId: paymentIntent.id,
      amount: product.price,
      currency: "usd",
      description: `Payment for  ${product.name}`,
      status: "succeeded",
    });
    //Render the payment page
    res.render("payment", {
      title: "Complete Payment",
      product,
      clientSecret: paymentIntent.client_secret,
      customer,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error Processing Checkout",
    });
  }
};

// @desc    Show payment success page
// @route   GET /payment/success (frontend only)
// @access  Public
exports.paymentSuccess = (req, res) => {
  res.render("success");
};

// @desc     Show all payments page
// @route   GET /payments (frontend only)
// @access  Public
exports.showAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("customer", "name email")
      .sort("-createdAt");
    res.render("payments/index", {
      payments,
    });
  } catch (error) {
    res.status(500).render("error", {
      message: "Error Processing Checkout",
    });
  }
};

// @desc    Manual payment status update (to replace webhook)
// @route   POST /payments/update/:paymentIntent (frontend only)
// @access  Public
