# Payment Session ID Error - Debug Guide

## Problem
Getting error: `payment_session_id is not present or is invalid` when trying to make a payment on deployed site.

## Common Causes
1. **Environment variables not set correctly on deployment server**
2. **Mismatch between frontend and backend Cashfree environment (sandbox vs production)**
3. **Invalid or missing Cashfree credentials**
4. **Cashfree API returning errors but not properly communicated to frontend**

## Step-by-Step Debugging

### Step 1: Check Diagnostic Endpoint
I've created a diagnostic endpoint to help identify the issue:

**Access the diagnostic endpoint:**
```
https://your-deployed-site.com/api/cashfree/diagnose
```

This will return:
- All environment variables status (SET or NOT_SET)
- Whether Cashfree instance can be created
- Whether a test order can be created
- The payment_session_id prefix (to identify sandbox vs production)

### Step 2: Verify Environment Variables on Deployment

Make sure these environment variables are set on your deployment platform (Vercel/Netlify/etc.):

#### Required Backend Variables:
- `CASHFREE_APP_ID` - Your Cashfree App ID
- `CASHFREE_SECRET_KEY` - Your Cashfree Secret Key
- `CASHFREE_ENVIRONMENT` - Should be either `sandbox` or `production` (lowercase)
- `CASHFREE_DEFAULT_CUSTOMER_PHONE` - Default phone number (e.g., `9999999999`)

#### Required Frontend Variables:
- `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` - Should match `CASHFREE_ENVIRONMENT` (sandbox or production)
- `NEXT_PUBLIC_APP_URL` - Your deployed site URL (e.g., `https://www.yourthumbnail.com`)

#### Other Required Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_API_KEY`

### Step 3: Check for Environment Mismatch

The most common issue is having:
- Backend: `CASHFREE_ENVIRONMENT=sandbox`
- Frontend: `NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production`

Or vice versa. **These must match!**

### Step 4: Verify Cashfree Credentials

#### For Sandbox:
1. Log in to Cashfree Merchant Dashboard: https://merchant.cashfree.com/merchant/login
2. Go to **Developers** → **API Keys**
3. Make sure you're using the **Sandbox** credentials
4. Set `CASHFREE_ENVIRONMENT=sandbox`

#### For Production:
1. Complete KYC verification in Cashfree dashboard
2. Get production API credentials
3. Set `CASHFREE_ENVIRONMENT=production`

### Step 5: Check Server Logs

After deploying the updated code, try making a payment and check your server logs for:

```
[Cashfree] Creating order
[Cashfree] Order creation response
```

Look for detailed error information including:
- Whether payment_session_id was returned
- Any Cashfree API errors
- Environment configuration details

### Step 6: Test Payment Flow

1. Try accessing `/api/cashfree/diagnose` first
2. Check the browser console for detailed error logs
3. Try making a test payment
4. Check server logs immediately after the error

## Quick Fixes

### Fix 1: Environment Not Set
If diagnostic shows `NOT_SET` for any required variables:
1. Add the missing environment variables to your deployment platform
2. Redeploy your application
3. Test again

### Fix 2: Environment Mismatch
If backend is in sandbox but frontend is in production (or vice versa):
1. Set both `CASHFREE_ENVIRONMENT` and `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` to the same value
2. Redeploy
3. Clear browser cache
4. Test again

### Fix 3: Invalid Credentials
If you see authentication errors in the diagnostic:
1. Double-check your Cashfree credentials
2. Make sure you're using the right credentials for your environment (sandbox vs production)
3. Regenerate credentials if needed
4. Update environment variables
5. Redeploy

### Fix 4: Wrong App URL
If return_url is incorrect:
1. Set `NEXT_PUBLIC_APP_URL` to your actual deployed URL (without trailing slash)
2. Example: `https://www.yourthumbnail.com` (not `https://www.yourthumbnail.com/`)
3. Redeploy

## Deployment Platform Specific

### Vercel
1. Go to Project Settings → Environment Variables
2. Add/update all required variables
3. Make sure to add them for **Production** environment
4. Redeploy from Deployments tab

### Netlify
1. Go to Site Settings → Environment Variables
2. Add/update all required variables
3. Trigger a new deploy

### Other Platforms
Consult your platform's documentation on setting environment variables.

## Testing Checklist

- [ ] All environment variables are set on deployment platform
- [ ] `CASHFREE_ENVIRONMENT` and `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` match
- [ ] Cashfree credentials are valid for the selected environment
- [ ] `NEXT_PUBLIC_APP_URL` is set to correct deployed URL
- [ ] Application has been redeployed after setting variables
- [ ] Diagnostic endpoint returns SUCCESS for orderCreationTest
- [ ] Browser cache cleared
- [ ] Payment flow tested

## Still Having Issues?

If the problem persists after following all steps:

1. Access the diagnostic endpoint and save the full response
2. Try making a payment and save:
   - Browser console logs
   - Network tab showing the API calls
   - Server logs from your deployment platform
3. Check if the payment_session_id starts with:
   - `session_sandbox_` - You're in sandbox mode
   - `session_` (without sandbox) - You're in production mode
4. Verify this matches your `CASHFREE_ENVIRONMENT` setting

## Support Resources

- Cashfree Documentation: https://docs.cashfree.com/
- Cashfree Support: https://www.cashfree.com/contact-us/
- Check Cashfree API status: https://status.cashfree.com/

