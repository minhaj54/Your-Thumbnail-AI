# Google OAuth Setup Guide

This guide will help you configure Google OAuth authentication for local development and production.

## OAuth Flow Overview

1. User clicks "Sign in with Google" → Redirected to Google OAuth
2. Google authenticates → Redirects to **Supabase callback URL**
3. Supabase processes OAuth → Redirects to **your app callback page**

## Step 1: Google Cloud Console Setup

### 1.1 Create OAuth 2.0 Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen first:
   - Choose **External** user type
   - Fill in app information
   - Add your email as a test user (for development)
   - Add required scopes: `openid`, `email`, `profile`

### 1.2 Configure OAuth Client

1. Choose **Web application** as the application type
2. Name it (e.g., "Thumbnail Builder - Web")

### 1.3 Add Authorized JavaScript Origins

Add these URLs:

**For Local Development:**
```
http://localhost:3000
```

**For Production:**
```
https://yourdomain.com
```

### 1.4 Add Authorized Redirect URIs

**IMPORTANT:** Add your **Supabase callback URL**, not your app URL!

**For Local Development (if using hosted Supabase):**
```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

**For Production:**
```
https://<your-project-ref>.supabase.co/auth/v1/callback
```

**Note:** Replace `<your-project-ref>` with your actual Supabase project reference ID. You can find this in your Supabase Dashboard → Settings → API → Project URL (it's the part between `https://` and `.supabase.co`).

**Example:**
If your Supabase URL is `https://abcdefghijklmnop.supabase.co`, then your redirect URI is:
```
https://abcdefghijklmnop.supabase.co/auth/v1/callback
```

### 1.5 Save Credentials

1. Click **Create**
2. Copy the **Client ID** and **Client Secret**
3. You'll need these for Step 2

## Step 2: Supabase Dashboard Setup

### 2.1 Enable Google Provider

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Google** in the list
5. Toggle **Enable Google provider** to ON

### 2.2 Add Credentials

1. Paste your **Google Client ID** from Step 1.5
2. Paste your **Google Client Secret** from Step 1.5
3. Click **Save**

### 2.3 Configure Redirect URLs (Optional)

Supabase automatically handles the callback URL, but you can verify it in:
- **Authentication** → **URL Configuration**
- The callback URL should be: `https://<your-project-ref>.supabase.co/auth/v1/callback`

## Step 3: Local Development Testing

### 3.1 Start Your Development Server

```bash
npm run dev
```

### 3.2 Test the Flow

1. Navigate to `http://localhost:3000/auth/signin`
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authentication, you'll be redirected back to your app at `http://localhost:3000/auth/callback`
5. The app will then redirect you to `/dashboard`

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URI in Google Cloud Console doesn't match what Supabase is using.

**Solution:**
1. Make sure you added `https://<your-project-ref>.supabase.co/auth/v1/callback` (not `http://localhost:3000/auth/v1/callback`)
2. Double-check your Supabase project reference ID
3. Wait a few minutes after adding the redirect URI (Google may cache changes)

### Error: "OAuth provider not enabled"

**Problem:** Google provider is not enabled in Supabase Dashboard.

**Solution:**
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable the Google provider
3. Make sure Client ID and Client Secret are saved

### Error: "Invalid client credentials"

**Problem:** Wrong Client ID or Client Secret in Supabase Dashboard.

**Solution:**
1. Verify you copied the correct credentials from Google Cloud Console
2. Make sure there are no extra spaces
3. Re-enter the credentials in Supabase Dashboard

### Local Development Not Working

**Problem:** OAuth works in production but not locally.

**Solution:**
1. Make sure `http://localhost:3000` is added to **Authorized JavaScript Origins** in Google Cloud Console
2. The redirect URI should still be the Supabase URL (not localhost)
3. Make sure your `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_URL`

## Production Setup

For production, follow the same steps but:

1. **Add your production domain to Authorized JavaScript Origins** in Google Cloud Console:
   ```
   https://yourdomain.com
   https://www.yourdomain.com  (if you use www)
   ```

2. **The redirect URI remains the same** (Supabase callback):
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```

3. **Set production environment variables** in your hosting platform (Vercel, Netlify, etc.):
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```
   **Important:** 
   - Use your production domain (not localhost)
   - No trailing slash
   - Must start with `https://`

4. **Update Supabase Redirect URL Allowlist** (if required):
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your production callback URL: `https://yourdomain.com/auth/callback`
   - This allows Supabase to redirect back to your production site

5. **Rebuild and redeploy** your application after setting environment variables

## Summary

- **Google Cloud Console:** Add `https://<your-project-ref>.supabase.co/auth/v1/callback` as redirect URI
- **Supabase Dashboard:** Add Google Client ID and Client Secret
- **Your App:** Already configured! The callback page at `/auth/callback` handles the final redirect

The key point: **Google redirects to Supabase first, then Supabase redirects to your app.**

