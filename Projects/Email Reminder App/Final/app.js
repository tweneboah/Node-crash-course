require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const expressLayouts = require("express-ejs-layouts");
const Reminder = require("./models/reminder");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// MongoDB Connection
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/email-reminder",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

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
  res.render("index", {
    title: "Email Reminder App",
    currentPage: "home",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About - Email Reminder App",
    currentPage: "about",
  });
});

app.get("/reminders", async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ scheduledTime: 1 });
    res.render("reminders", {
      reminders,
      title: "My Reminders",
      currentPage: "reminders",
    });
  } catch (error) {
    res.redirect("/?error=true");
  }
});

app.get("/schedule", (req, res) => {
  res.render("schedule", {
    title: "Schedule Reminder",
    currentPage: "schedule",
  });
});

app.post("/schedule", async (req, res) => {
  try {
    const { email, message, datetime } = req.body;
    const reminder = new Reminder({
      email,
      message,
      scheduledTime: new Date(datetime),
    });
    await reminder.save();
    res.redirect("/schedule?success=true");
  } catch (error) {
    res.redirect("/schedule?error=true");
  }
});

// Cron job to check and send reminders
cron.schedule("* * * * *", async () => {
  try {
    const now = new Date();
    const reminders = await Reminder.find({
      scheduledTime: { $lte: now },
      sent: false,
    });

    for (const reminder of reminders) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: reminder.email,
        subject: "Reminder",
        text: reminder.message,
      });

      reminder.sent = true;
      await reminder.save();
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
