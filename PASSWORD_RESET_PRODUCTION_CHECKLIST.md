# Password Reset - Production Deployment Checklist

## ✅ Code is Ready
The password reset functionality is complete and working locally. You can push the code to production.

## 🔧 Required Production Configuration

### 1. Environment Variables
Make sure these are set in your production environment (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_APP_URL="https://yourdomain.com"  # ⚠️ MUST be your production URL (no trailing slash)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

**Important**: `NEXT_PUBLIC_APP_URL` must be set to your production domain (e.g., `https://yourthumbnail.com`)

### 2. Supabase Dashboard Configuration

#### A. Whitelist Redirect URL
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **URL Configuration**
4. Under **Redirect URLs**, add:
   ```
   https://yourdomain.com/auth/reset-password
   ```
5. Click **Save**

#### B. Verify Email Templates
1. Go to **Authentication** → **Email Templates**
2. Ensure **Reset Password** template is enabled
3. For production, consider configuring custom SMTP:
   - Go to **Project Settings** → **Auth** → **SMTP Settings**
   - Configure your SMTP provider (Gmail, SendGrid, etc.)

### 3. Test After Deployment

1. **Test the flow**:
   - Go to your production site
   - Click "Forgot password?" on login page
   - Enter a valid email
   - Check for the "Sent" confirmation
   - Check email inbox (and spam folder)
   - Click the reset link
   - Set new password

2. **Check logs**:
   - Monitor server logs for any `[Password Reset]` errors
   - Check Supabase Auth logs: **Authentication** → **Logs**

## 🚀 Deployment Steps

1. **Push to Git**:
   ```bash
   git add .
   git commit -m "Add password reset functionality"
   git push
   ```

2. **Set Environment Variables** in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Other: Follow your platform's documentation

3. **Configure Supabase** (see section 2 above)

4. **Deploy** (usually automatic after git push)

5. **Test** (see section 3 above)

## ⚠️ Common Production Issues

### Issue: "Configuration error: NEXT_PUBLIC_APP_URL is not set"
**Solution**: Set `NEXT_PUBLIC_APP_URL` in your production environment variables

### Issue: "Redirect URL not whitelisted"
**Solution**: Add your production URL to Supabase redirect URLs (see section 2A)

### Issue: Emails not sending
**Solution**: 
- Check Supabase Auth logs
- Verify email templates are enabled
- Consider setting up custom SMTP for production

### Issue: Email goes to spam
**Solution**: 
- Configure custom SMTP with proper domain
- Set up SPF/DKIM records for your domain

## ✅ Verification

After deployment, verify:
- [ ] `NEXT_PUBLIC_APP_URL` is set to production URL
- [ ] Redirect URL is whitelisted in Supabase
- [ ] Can submit forgot password form
- [ ] See "Sent" confirmation message
- [ ] Receive email (check spam folder)
- [ ] Reset link works and redirects correctly
- [ ] Can set new password successfully

## 📝 Notes

- The code automatically handles both development and production environments
- Error messages are more detailed in development mode
- Production mode shows generic error messages for security
- The fallback to client-side method ensures it works even if API route has issues

