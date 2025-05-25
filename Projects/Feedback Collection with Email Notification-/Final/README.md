# Feedback Collection with Email Notification

A simple feedback collection system built with Express.js, MongoDB, and Bootstrap that sends email notifications for new feedback submissions.

## Features

- User-friendly feedback form
- Email notifications for new submissions
- Admin dashboard to view all feedback
- Responsive design with Bootstrap
- MongoDB database integration

## Prerequisites

- Node.js and npm
- MongoDB (local or Atlas)
- Gmail account for email notifications

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=3000
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-specific-password
     ADMIN_EMAIL=admin@example.com
     MONGODB_URI=mongodb://localhost:27017/feedback-app
     ```

4. Start MongoDB:

   - If using local MongoDB, ensure the service is running
   - If using MongoDB Atlas, update the MONGODB_URI with your connection string

5. Start the server:
   ```bash
   node app.js
   ```

## Usage

1. Access the feedback form at `http://localhost:3000`
2. Submit feedback through the form
3. View all feedback submissions at `http://localhost:3000/admin`

## Email Configuration

To use Gmail for sending emails:

1. Enable 2-factor authentication in your Google account
2. Generate an App Password
3. Use the App Password in the `EMAIL_PASS` environment variable

## Technologies Used

- Express.js
- MongoDB with Mongoose
- EJS (Embedded JavaScript templates)
- Bootstrap 5
- Nodemailer
- Node.js
