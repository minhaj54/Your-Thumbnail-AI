# Google OAuth Troubleshooting Guide

## Issue: DNS Error (ENOTFOUND) After Google Sign Up

If you're seeing an error like:
```
[TypeError: fetch failed] {
  cause: [Error: getaddrinfo ENOTFOUND ibkfbqvojqmhvkzmmdvl.supabase.co]
}
```

This means your app cannot connect to Supabase. Here's how to fix it:

### Step 1: Verify Your Environment Variables

1. Check your `.env.local` file exists in the project root
2. Verify `NEXT_PUBLIC_SUPABASE_URL` is set correctly:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
```

**Important:**
- Make sure there's no trailing slash
- Make sure it starts with `https://`
- The format should be: `https://[project-ref].supabase.co`

### Step 2: Get Your Correct Supabase URL

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (not the anon key)
5. It should look like: `https://abcdefghijklmnop.supabase.co`

### Step 3: Update Your .env.local File

1. Open `.env.local` in your project root
2. Update the `NEXT_PUBLIC_SUPABASE_URL` with the correct URL from Step 2
3. Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is also set correctly

Example `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Restart Your Development Server

After updating environment variables:

1. Stop your dev server (Ctrl+C)
2. Start it again:
```bash
npm run dev
```

**Important:** Environment variables are only loaded when the server starts. You must restart after changing them.

### Step 5: Verify Supabase Project is Active

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Check if your project shows as "Active"
3. If it's paused, click "Resume project"

### Step 6: Test Network Connectivity

If the issue persists, test if you can reach Supabase:

1. Open your browser
2. Navigate to your Supabase URL: `https://[your-project-ref].supabase.co`
3. You should see the Supabase API welcome page

If you can't reach it:
- Check your internet connection
- Check if you're behind a firewall/proxy
- Try accessing from a different network

### Step 7: Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any additional error messages
4. Check Network tab to see if requests are being made

### Common Issues and Solutions

#### Issue: "Account created but redirect fails"

**Solution:** The OAuth flow worked, but the callback can't exchange the code. This is usually because:
- Supabase URL is incorrect in `.env.local`
- Environment variables weren't reloaded (restart server)
- Network/DNS issue

#### Issue: "Cannot connect to authentication server"

**Solution:**
1. Verify `NEXT_PUBLIC_SUPABASE_URL` in `.env.local`
2. Make sure it matches your Supabase Dashboard → Settings → API → Project URL
3. Restart your dev server

#### Issue: "Session not found"

**Solution:**
1. Clear browser cookies for localhost
2. Try signing in again
3. Check if Supabase project is active

### Still Having Issues?

1. **Double-check your Supabase URL format:**
   - ✅ Correct: `https://abcdefghijklmnop.supabase.co`
   - ❌ Wrong: `https://abcdefghijklmnop.supabase.co/`
   - ❌ Wrong: `http://abcdefghijklmnop.supabase.co`
   - ❌ Wrong: `abcdefghijklmnop.supabase.co`

2. **Verify your project reference:**
   - Go to Supabase Dashboard → Settings → API
   - The Project URL shows your project reference
   - Make sure it matches what's in your `.env.local`

3. **Check for typos:**
   - Copy-paste the URL from Supabase Dashboard to avoid typos
   - Make sure there are no extra spaces

4. **Restart everything:**
   - Stop the dev server
   - Clear browser cache/cookies
   - Restart the dev server
   - Try again

### Quick Verification Script

You can verify your environment variables are loaded correctly by temporarily adding this to any page:

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

If it shows `undefined` or `REDACTED`, your environment variables aren't loaded correctly.

