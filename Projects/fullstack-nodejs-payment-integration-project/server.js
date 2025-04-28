const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const methodOverride = require("method-override");
const expressLayouts = require("express-ejs-layouts");
const { productRouter, apiRouter } = require("./routes/productRoutes");
const connectDB = require("./config/db");
const { paymentRouter } = require("./routes/paymentRoutes");

const app = express();
//Load env vars
dotenv.config();
//Connect to database
connectDB();
//Routes
//View engine setup
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
//static files
//Method override for PUT/DELETE in forms
//Enable cors
//Body parser
app.use(express.urlencoded({ extended: true }));
//Mount api routes
//Mount web frontend routers
app.use("/products", productRouter);
app.use("/", paymentRouter);
//Home route
app.get("/", (req, res) => {
  res.render("index.ejs");
});
//Handle 404
//Error handling
//Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
