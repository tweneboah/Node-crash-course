require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");
const nodemailer = require("nodemailer");
const expressLayouts = require("express-ejs-layouts");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true in production with HTTPS
  })
);

// View engine setup
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Home - OTP Auth System" });
});

app.get("/how-it-works", (req, res) => {
  res.render("how-it-works", { title: "How It Works - OTP Auth System" });
});

app.get("/login", (req, res) => {
  res.render("login", {
    title: "Login - OTP Auth System",
    error: req.query.error || null,
  });
});

app.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  // Store OTP in session
  req.session.otp = otp;
  req.session.email = email;
  req.session.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

  // Send email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP for Login",
      text: `Your OTP is: ${otp}. This OTP will expire in 5 minutes.`,
    });
    res.render("verify-otp", {
      title: "Verify OTP - OTP Auth System",
      email: email,
      error: null,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.render("login", {
      title: "Login - OTP Auth System",
      error: "Failed to send OTP. Please try again.",
    });
  }
});

app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  if (!req.session.otp || !req.session.otpExpiry) {
    return res.render("verify-otp", {
      title: "Verify OTP - OTP Auth System",
      email: req.session.email,
      error: "OTP session expired. Please try again.",
    });
  }

  if (Date.now() > req.session.otpExpiry) {
    return res.render("verify-otp", {
      title: "Verify OTP - OTP Auth System",
      email: req.session.email,
      error: "OTP has expired. Please request a new one.",
    });
  }

  if (parseInt(otp) === req.session.otp) {
    req.session.isAuthenticated = true;
    res.render("dashboard", {
      title: "Dashboard - OTP Auth System",
      email: req.session.email,
    });
  } else {
    res.render("verify-otp", {
      title: "Verify OTP - OTP Auth System",
      email: req.session.email,
      error: "Invalid OTP. Please try again.",
    });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
