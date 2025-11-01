# Gmail Setup Guide for Email Service

This guide will help you configure Gmail to send emails from your application for free.

## Prerequisites

- A Gmail account
- 2-Step Verification enabled on your Google Account

## Step-by-Step Setup

### 1. Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google", click on **2-Step Verification**
3. Follow the prompts to enable 2-Step Verification if not already enabled

### 2. Generate an App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Or navigate: Google Account → Security → 2-Step Verification → App passwords
2. You may be asked to sign in again
3. In the "Select app" dropdown, choose **Mail**
4. In the "Select device" dropdown, choose **Other (Custom name)**
5. Enter a name like "Nexus Backend" or "My Node App"
6. Click **Generate**
7. Google will display a 16-character password (e.g., `abcd efgh ijkl mnop`)
8. **Copy this password** - you won't be able to see it again!

### 3. Configure Your Environment Variables

1. Copy `.env.example` to `.env` if you haven't already:
   ```bash
   cp .env.example .env
   ```

2. Edit your `.env` file and add your Gmail credentials:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop
   EMAIL_FROM_NAME=Your App Name
   ```

   **Important Notes:**
   - Use your full Gmail address for `EMAIL_USER`
   - Use the 16-character App Password (without spaces) for `EMAIL_PASSWORD`
   - The App Password is NOT your regular Gmail password
   - `EMAIL_FROM_NAME` is the display name recipients will see

### 4. Test Your Configuration

You can test your email configuration by running your application and triggering an email send (e.g., user registration, password reset).

The logs will show:
```
[EmailService] Using Gmail account your-email@gmail.com
[EmailService] Message sent: <message-id>
[EmailService] Email sent to: recipient@example.com
```

## Gmail Sending Limits

Gmail has the following sending limits for free accounts:

- **500 emails per day** for regular Gmail accounts
- **2,000 emails per day** for Google Workspace accounts
- Maximum of **500 external recipients per day**

If you exceed these limits, you'll receive a bounce message, and you won't be able to send more messages until the next day.

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solutions:**
1. Make sure you're using an App Password, not your regular Gmail password
2. Verify that 2-Step Verification is enabled
3. Remove any spaces from the App Password when copying it to `.env`
4. Try generating a new App Password

### Error: "Unable to connect to Gmail SMTP server"

**Solutions:**
1. Check your internet connection
2. Verify that your firewall isn't blocking port 587
3. Make sure the Gmail SMTP settings are correct:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Secure: `false` (STARTTLS is used)

### Emails going to spam

**Solutions:**
1. Ensure your email content isn't flagged as spam (avoid spam trigger words)
2. Use a custom domain email with proper SPF/DKIM records for production
3. For production, consider using a dedicated email service like SendGrid, AWS SES, or Mailgun

### Rate limiting / "Daily sending quota exceeded"

If you hit the daily limit:
1. Wait 24 hours for the quota to reset
2. Consider upgrading to Google Workspace for higher limits
3. For production with high volume, use a dedicated email service

## Security Best Practices

1. **Never commit your `.env` file** - it contains sensitive credentials
2. **Use App Passwords** instead of your regular Gmail password
3. **Rotate App Passwords periodically** for better security
4. **Revoke unused App Passwords** from the [App Passwords page](https://myaccount.google.com/apppasswords)
5. **Monitor your Gmail account** for any suspicious activity

## Production Considerations

While Gmail works great for development and testing, for production applications consider:

1. **Dedicated Email Services:**
   - SendGrid (free tier: 100 emails/day)
   - AWS SES (free tier: 62,000 emails/month)
   - Mailgun (free tier: 5,000 emails/month)
   - Postmark (free tier: 100 emails/month)

2. **Benefits of dedicated services:**
   - Higher sending limits
   - Better deliverability
   - Email analytics and tracking
   - Professional support
   - Built-in bounce and complaint handling
   - Custom domain authentication (SPF, DKIM, DMARC)

3. **When to switch from Gmail:**
   - Sending more than 500 emails per day
   - Need better deliverability rates
   - Require email tracking and analytics
   - Building a customer-facing production application

## Additional Resources

- [Google Account Security](https://myaccount.google.com/security)
- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Nodemailer Documentation](https://nodemailer.com/about/)
- [Gmail Sending Limits](https://support.google.com/mail/answer/22839)
