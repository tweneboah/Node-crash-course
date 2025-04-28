const express = require("express");
const {
  showCreateForm,
  createProduct,
  getProducts,
  getProduct,
} = require("../controllers/productController");
const productRouter = express.Router();

//Web frontend routes
productRouter.get("/new", showCreateForm);
productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);

module.exports = { productRouter };
