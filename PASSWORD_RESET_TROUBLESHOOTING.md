# Password Reset Email Not Sending - Troubleshooting Guide

## Common Issues and Solutions

### 1. Redirect URL Not Whitelisted in Supabase

**Problem**: Supabase requires redirect URLs to be whitelisted for security.

**Solution**:
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   - `http://localhost:3000/auth/reset-password` (for development)
   - `https://yourdomain.com/auth/reset-password` (for production)
5. Click **Save**

### 2. Email Provider Not Configured

**Problem**: Supabase's default email provider has low rate limits and may not work reliably.

**Solution**:
1. Go to **Authentication** → **Email Templates** in Supabase Dashboard
2. Check if email templates are enabled
3. For production, configure a custom SMTP provider:
   - Go to **Project Settings** → **Auth** → **SMTP Settings**
   - Configure your SMTP provider (Gmail, SendGrid, etc.)

### 3. Check Supabase Auth Logs

1. Go to **Authentication** → **Logs** in Supabase Dashboard
2. Look for errors when attempting password reset
3. Check for rate limiting or configuration errors

### 4. Verify Environment Variables

Make sure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # or your production URL
```

### 5. Check Browser Console and Server Logs

- Open browser DevTools → Console
- Check server logs (terminal where `npm run dev` is running)
- Look for error messages starting with `[Password Reset]`

### 6. Test with Different Email

- Try with a different email address
- Check spam/junk folder
- Some email providers may block automated emails

### 7. Verify Email Exists in Supabase

- Go to **Authentication** → **Users** in Supabase Dashboard
- Verify the email address exists in your user list

## Quick Test

1. Open browser DevTools (F12)
2. Go to Console tab
3. Try the password reset
4. Check for any error messages
5. Check Network tab to see the API response

## Still Not Working?

Check the server logs for detailed error messages. The API route now logs:
- The redirect URL being used
- Any Supabase errors
- Configuration issues

Look for log messages starting with `[Password Reset]` in your terminal.

