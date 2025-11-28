# Fix: Redirecting to Localhost in Production

## The Problem

You're seeing `http://localhost:3000/?code=...` in your production site after Google OAuth.

## Root Cause

Supabase Dashboard has `localhost:3000` configured in the **Site URL** or **Redirect URLs**, which overrides the redirect URL passed in code.

## Solution: Update Supabase Configuration

### Step 1: Open Supabase Dashboard

1. Go to [https://app.supabase.com/](https://app.supabase.com/)
2. Select your project

### Step 2: Fix Site URL

1. Navigate to **Authentication** → **URL Configuration**
2. Find the **Site URL** field
3. **Change it from:**
   ```
   http://localhost:3000
   ```
   **To your production URL:**
   ```
   https://yourdomain.com
   ```
   (Replace `yourdomain.com` with your actual domain)

4. **Important:** 
   - Use `https://` (not `http://`)
   - No trailing slash
   - Use your actual production domain

### Step 3: Update Redirect URLs

1. Still in **Authentication** → **URL Configuration**
2. Scroll to **Redirect URLs** section
3. **Remove** any localhost URLs:
   - ❌ `http://localhost:3000/auth/callback`
   - ❌ `http://localhost:3000/**`
4. **Add** your production callback URL:
   - ✅ `https://yourdomain.com/auth/callback`
   - ✅ `https://yourdomain.com/**` (wildcard for all routes)

5. **Example Redirect URLs list:**
   ```
   https://yourdomain.com/auth/callback
   https://yourdomain.com/**
   ```

### Step 4: Save Changes

1. Click **Save** at the bottom of the page
2. Wait a few seconds for changes to propagate

### Step 5: Test

1. Go to your production site
2. Try signing up/signing in with Google
3. You should now be redirected to your production domain, not localhost

## Why This Happens

When you set up OAuth locally, you likely added `localhost:3000` to Supabase's configuration. Supabase uses the **Site URL** as a fallback if the redirect URL in code doesn't match allowed URLs. Even if your code passes the correct production URL, if Supabase's Site URL is still localhost, it may redirect there.

## Additional Checks

### Verify Your Code is Correct

The code now uses `window.location.origin` which automatically uses the current domain. But you can verify:

1. Open browser DevTools (F12) on your production site
2. Go to Console tab
3. Look for any OAuth-related logs
4. The redirect URL should show your production domain

### Environment Variables (Optional)

While the code now uses `window.location.origin` automatically, you can still set:

```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

This is optional but can be useful for edge cases.

## Still Not Working?

1. **Clear browser cache** - Old redirects might be cached
2. **Try incognito mode** - To rule out browser cache
3. **Check Supabase logs:**
   - Go to Supabase Dashboard → Logs → Auth Logs
   - Look for redirect-related errors
4. **Verify the redirect URL in code:**
   - Add a console.log temporarily to see what URL is being used
   - Check browser Network tab to see the actual OAuth request

## Quick Fix Summary

1. ✅ Supabase Dashboard → Authentication → URL Configuration
2. ✅ Change **Site URL** from `http://localhost:3000` to `https://yourdomain.com`
3. ✅ Remove localhost from **Redirect URLs**
4. ✅ Add production URL to **Redirect URLs**: `https://yourdomain.com/auth/callback`
5. ✅ Save and test

This should fix the issue immediately!

