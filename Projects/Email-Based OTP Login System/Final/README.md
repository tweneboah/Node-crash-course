# Email-Based OTP Login System
A secure login system that uses email-based OTP (One-Time Password) for authentication instead of traditional passwords.

# Features
- Email-based OTP authentication
- Session management
- Modern UI with Bootstrap and Bootstrap Icons
- Secure OTP generation and validation
- 5-minute OTP expiry

## Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Gmail account for sending OTP emails

## Setup
1. Clone the repository
2. Install dependencies:
```bash
   npm install
```
3. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   ```
4. For Gmail setup:
   - Enable 2-Step Verification in your Google Account
   - Generate an App Password for this application
   - Use the generated App Password in the `.env` file

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Enter your email address on the login page
2. Check your email for the 6-digit OTP
3. Enter the OTP on the verification page
4. Upon successful verification, you'll be redirected to the dashboard
5. Click the logout button to end your session

## Security Notes

- OTPs expire after 5 minutes
- Each OTP can only be used once
- Session data is stored securely
- In production, ensure HTTPS is enabled
