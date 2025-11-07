# Email Notification Setup Guide

This guide will help you set up email notifications to receive alerts when someone visits your portfolio website.

## Features

✅ **Real-time Notifications**: Get instant email alerts when visitors access your site  
✅ **Detailed Information**: Receive visitor IP, user agent, page visited, and referrer data  
✅ **Professional Email Design**: Beautiful HTML emails with clean formatting  
✅ **Smart Tracking**: One notification per page per session to avoid spam  
✅ **Production-Only**: Notifications are disabled in development mode

## Prerequisites

- Gmail account (physionerdy@gmail.com)
- Gmail App Password generated
- Environment variables configured

## Step 1: Generate Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (must be enabled)
3. Scroll to **App passwords** section
4. Click **Select app** → Choose **Mail**
5. Click **Select device** → Choose **Other** → Enter "Portfolio Site"
6. Click **Generate**
7. Copy the 16-character password (format: `xxxx xxxx xxxx xxxx`)

## Step 2: Configure Environment Variables

### For Local Development

Create a `.env.local` file in the root directory with:

```env
# Email Notification Settings
SMTP_URL=smtps://physionerdy@gmail.com:YOUR_APP_PASSWORD@smtp.gmail.com:465
FROM_EMAIL=physionerdy@gmail.com
EMAIL=codephysio@gmail.com

# Optional: Enable notifications in localhost for testing
NEXT_PUBLIC_ENABLE_DEV_NOTIFICATIONS=true
```

**Important**: Replace `YOUR_APP_PASSWORD` with the actual app password from Step 1.

**Note**: If your password contains special characters, URL-encode them:
- Space: `%20`
- `!`: `%21`
- `@`: `%40`
- `#`: `%23`

### For Production (Vercel)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Name | Value |
|------|-------|
| `SMTP_URL` | `smtps://physionerdy@gmail.com:YOUR_APP_PASSWORD@smtp.gmail.com:465` |
| `FROM_EMAIL` | `physionerdy@gmail.com` |
| `EMAIL` | `codephysio@gmail.com` |
| `NEXT_PUBLIC_ENABLE_DEV_NOTIFICATIONS` | `true` (optional, for localhost testing) |

4. Click **Save** for each variable
5. Redeploy your application for changes to take effect

### For GitHub Actions (CI/CD)

Add the following secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

| Secret Name | Value |
|-------------|-------|
| `SMTP_URL` | `smtps://physionerdy@gmail.com:YOUR_APP_PASSWORD@smtp.gmail.com:465` |
| `FROM_EMAIL` | `physionerdy@gmail.com` |
| `EMAIL` | `codephysio@gmail.com` |
| `NEXT_PUBLIC_ENABLE_DEV_NOTIFICATIONS` | `true` (optional, for localhost testing) |

## Step 3: Install Dependencies

Run the following command to install the required package:

```bash
npm install
```

This will install `nodemailer` which is required for sending emails.

## Step 4: Test the Setup

### Local Testing

1. Start your development server:
```bash
npm run dev
```

2. The notification system is **disabled** in development mode by default
3. To test in development, add this to your `.env.local` file:
```env
NEXT_PUBLIC_ENABLE_DEV_NOTIFICATIONS=true
```
4. Restart your dev server after adding the environment variable

### Production Testing

1. Deploy your site to production
2. Visit your deployed website
3. Check your email (codephysio@gmail.com) for a notification

## How It Works

1. **Automatic Tracking**: The `useVisitorNotification` hook is integrated into `_app.js`, tracking all page visits
2. **Smart Filtering**: Only one notification per page per session to avoid spam
3. **API Endpoint**: `/api/visitor-notification` handles email sending using nodemailer
4. **Gmail SMTP**: Connects to Gmail's SMTP server using your app password
5. **Beautiful Emails**: Sends professionally formatted HTML emails with visitor details

## Email Content

Each notification email includes:

- 📄 **Page**: The URL path visited
- 🕒 **Time**: Timestamp of the visit
- 🌐 **IP Address**: Visitor's IP address
- 💻 **User Agent**: Browser and device information
- 🔗 **Referrer**: Where the visitor came from

## Troubleshooting

### Not Receiving Emails?

1. **Check Environment Variables**: Ensure all variables are set correctly
2. **Verify App Password**: Make sure you're using the Gmail App Password, not your regular password
3. **Check Spam Folder**: Emails might be filtered as spam initially
4. **Enable 2FA**: Gmail App Passwords require 2-Step Verification to be enabled
5. **URL Encoding**: Special characters in password must be URL-encoded
6. **Check Logs**: In Vercel, check Function Logs for any errors

### Common Errors

**"Invalid login"**: App password is incorrect or 2FA not enabled  
**"Authentication failed"**: Check URL encoding of special characters  
**"Connection timeout"**: SMTP URL format is incorrect  
**"No notifications in dev mode"**: Expected behavior, test in production

## Security Best Practices

✅ **Never commit** `.env.local` or any file containing real credentials  
✅ **Use App Passwords** instead of your main Gmail password  
✅ **Rotate credentials** periodically  
✅ **Monitor email quota** to avoid Gmail rate limits (500 emails/day for free accounts)  
✅ **Use environment variables** for all sensitive data

## Rate Limiting

Gmail has sending limits:
- **Free accounts**: 500 emails per day
- **Google Workspace**: 2,000 emails per day

The current implementation sends one email per page per session, which should be well within limits for a personal portfolio.

## Customization

### Change Email Template

Edit `src/pages/api/visitor-notification.js` to customize the email HTML and styling.

### Adjust Notification Delay

Edit `src/lib/useVisitorNotification.js` and change the delay:

```javascript
const timer = setTimeout(sendNotification, 2000); // Change 2000 to desired milliseconds
```

### Filter Specific Pages

Modify the hook to exclude certain pages:

```javascript
if (currentPath.includes('/admin') || currentPath.includes('/api')) {
  return; // Skip notification for admin/api pages
}
```

## Your Current Configuration

Based on the credentials provided:

- **Gmail Account**: physionerdy@gmail.com
- **Notification Recipient**: codephysio@gmail.com  
- **App Password**: `olsv bban agdn klxn` (URL-encoded: `olsv%20bban%20agdn%20klxn`)

Your complete `SMTP_URL` should be:
```
smtps://physionerdy@gmail.com:olsv%20bban%20agdn%20klxn@smtp.gmail.com:465
```

## Need Help?

If you encounter any issues, check:
1. Vercel Function Logs for runtime errors
2. GitHub Actions logs for deployment issues
3. Browser console for client-side errors
4. Gmail account security settings

## Files Modified/Created

- ✅ `src/pages/api/visitor-notification.js` - Email sending API endpoint
- ✅ `src/lib/useVisitorNotification.js` - React hook for tracking visits
- ✅ `src/pages/_app.js` - Integrated visitor tracking
- ✅ `package.json` - Added nodemailer dependency
- ✅ `.env.example` - Environment variable template
- ✅ `.gitignore` - Updated to allow .env.example

---

**Setup Status**: ✅ Implementation Complete  
**Next Step**: Configure environment variables and deploy!
