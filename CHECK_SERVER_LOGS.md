# How to Check Server Logs

The payment API is returning a 500 error. To see what's wrong, check your **terminal where you're running `npm run dev`**.

You should see console logs like:
- 📦 Creating Cashfree order...
- 📦 Fetching Cashfree credentials...
- 📦 Getting user from Supabase...
- ✅ User found: <user-id>

If it stops at a certain log or shows an error, that's where the problem is.

## Most Common Issues:

### 1. Subscriptions table doesn't exist
**Fix**: Run the SQL migration in Supabase:
- Go to Supabase Dashboard → SQL Editor
- Copy contents of `supabase/migrations/002_add_pricing_functions.sql`
- Paste and run it

### 2. Cashfree module not working
**Fix**: The module should be installed. Check with:
```bash
npm list cashfree-pg
```

### 3. Environment variables not loading
**Fix**: Restart your dev server after adding env variables

## Quick Fix

Run this to see the actual error:
```bash
npm run dev
```

Then click upgrade and watch the terminal output - it will show the exact error message.

