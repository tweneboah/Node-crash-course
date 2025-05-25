module.exports = {
  port: process.env.PORT || 3000,
  email: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-specific-password",
    admin: process.env.ADMIN_EMAIL || "admin@example.com",
  },
  mongoURI: process.env.MONGODB_URI || "mongodb://localhost:27017/feedback-app",
};
