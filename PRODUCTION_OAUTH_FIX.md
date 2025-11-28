# Fix: OAuth Redirecting to Localhost in Production

## Problem

After signing up/signing in with Google on your deployed site, you're being redirected to `localhost:3000` instead of your production URL.

**Common symptom:** You see a URL like `http://localhost:3000/?code=...` in your production site.

## Solution

### Step 1: Set Production Environment Variable

In your hosting platform (Vercel, Netlify, Railway, etc.), add or update the environment variable:

```env
NEXT_PUBLIC_APP_URL=https://yourthumbnail.com
```

**Important:**
- Replace `yourdomain.com` with your actual production domain
- Use `https://` (not `http://`)
- **No trailing slash** (don't end with `/`)
- Must be set as an environment variable in your hosting platform

### Step 2: Rebuild and Redeploy

After setting the environment variable:

1. **Vercel:** 
   - Go to your project → Settings → Environment Variables
   - Add/update `NEXT_PUBLIC_APP_URL`
   - Click "Redeploy" or push a new commit

2. **Netlify:**
   - Go to Site settings → Environment variables
   - Add/update `NEXT_PUBLIC_APP_URL`
   - Trigger a new deploy

3. **Other platforms:**
   - Set the environment variable in your platform's settings
   - Rebuild/redeploy your application

### Step 3: Verify Configuration

1. Check that `NEXT_PUBLIC_APP_URL` is set correctly in your hosting platform
2. Make sure it matches your actual production domain
3. Verify the build completed successfully

### Step 4: Test

1. Visit your production site
2. Try signing up/signing in with Google
3. You should be redirected back to your production domain (not localhost)

## Why This Happens

The OAuth redirect URL is constructed using:
1. `NEXT_PUBLIC_APP_URL` (if set) - **preferred for production**
2. `window.location.origin` (fallback) - works but can be unreliable

When `NEXT_PUBLIC_APP_URL` is not set in production, the code falls back to `window.location.origin`, which should work, but there might be edge cases where it doesn't resolve correctly.

## Additional Checks

### Supabase Redirect URL Configuration (CRITICAL)

**This is likely the main issue!** Supabase Dashboard might have localhost configured:

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Authentication** → **URL Configuration**
4. Check the **Site URL** field:
   - ❌ **WRONG:** `http://localhost:3000`
   - ✅ **CORRECT:** `https://yourdomain.com` (your production URL)
5. Under **Redirect URLs**, check the list:
   - Remove `http://localhost:3000/auth/callback` if it's there
   - Add your production callback URL: `https://yourdomain.com/auth/callback`
   - Make sure localhost URLs are **NOT** in the list for production
6. Click **Save**

**Important:** The Site URL is used as a fallback redirect URL. If it's set to localhost, Supabase will redirect there even if you pass a different URL in the code.

### Google Cloud Console

Make sure your production domain is in **Authorized JavaScript Origins**:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized JavaScript origins**, add:
   ```
   https://yourdomain.com
   https://www.yourdomain.com  (if you use www)
   ```

## Quick Checklist

- [ ] **Supabase Site URL** is set to your production domain (NOT localhost)
- [ ] **Supabase Redirect URLs** includes `https://yourdomain.com/auth/callback`
- [ ] **Supabase Redirect URLs** does NOT include localhost URLs
- [ ] `NEXT_PUBLIC_APP_URL` is set in production environment variables (optional, code uses window.location.origin)
- [ ] Application has been rebuilt/redeployed after any changes
- [ ] Production domain is in Google Cloud Console Authorized JavaScript Origins

## Still Not Working?

1. **Clear browser cache** - Old redirect URLs might be cached
2. **Try incognito/private mode** - To rule out browser cache issues
3. **Check browser console** - Look for any JavaScript errors
4. **Verify environment variable** - Some platforms require a rebuild to pick up new env vars

If you're using Vercel, you can verify the environment variable is loaded by temporarily logging it:
```typescript
console.log('App URL:', process.env.NEXT_PUBLIC_APP_URL)
```

This should show your production URL, not `undefined`.

