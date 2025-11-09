# Cashfree Production Mode Setup

## You've Set Production Mode ✅

Both your environment variables are set to `production`:
- `CASHFREE_ENVIRONMENT=production`
- `NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production`

## Requirements for Production Mode

### 1. Complete KYC Verification with Cashfree

**Before you can use production mode, you MUST:**

1. Log in to Cashfree Merchant Dashboard: https://merchant.cashfree.com/merchant/login
2. Complete your KYC (Know Your Customer) verification
3. Wait for approval (usually 1-2 business days)
4. Get your **Production** credentials approved

**Without KYC approval, production mode will NOT work!**

### 2. Get Production API Credentials

Once KYC is approved:

1. Go to Cashfree Dashboard: https://merchant.cashfree.com/
2. Navigate to **Developers** → **API Keys**
3. Switch to **Production** tab (not Sandbox)
4. Copy your **Production** credentials:
   - App ID
   - Secret Key

**⚠️ IMPORTANT:** Production credentials are different from Sandbox credentials!

### 3. Update Your Environment Variables

On your deployment platform (Vercel/Netlify), set:

```bash
# Production Cashfree Credentials
CASHFREE_APP_ID=your_PRODUCTION_app_id
CASHFREE_SECRET_KEY=your_PRODUCTION_secret_key
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production

# Other variables
CASHFREE_DEFAULT_CUSTOMER_PHONE=9999999999
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 4. Verify Your Setup

After deploying with production credentials, visit:
```
https://your-site.com/api/cashfree/diagnose
```

You should see:
```json
{
  "orderCreationTest": "SUCCESS",
  "testOrder": {
    "environment_detected": "PRODUCTION"  // NOT "SANDBOX"
  },
  "environment": {
    "CASHFREE_ENVIRONMENT": "production",
    "NEXT_PUBLIC_CASHFREE_ENVIRONMENT": "production"
  }
}
```

## Common Production Issues

### Issue 1: KYC Not Completed

**Symptom:** API returns authentication errors or "Invalid credentials"

**Solution:**
1. Complete KYC verification at https://merchant.cashfree.com/
2. Wait for approval
3. Get production credentials after approval

### Issue 2: Using Sandbox Credentials in Production

**Symptom:** "payment_session_id is not present or is invalid"

**Solution:**
1. Verify you're using **Production** credentials (not Sandbox)
2. Production App IDs start differently than Sandbox IDs
3. Double-check you copied from the **Production** tab

### Issue 3: Environment Mismatch

**Symptom:** Payment session works but shows `session_sandbox_` prefix

**Solution:**
- You're using sandbox credentials while environment is set to production
- Get production credentials from Cashfree dashboard

## Testing Strategy

### 1. Test in Sandbox First (Recommended)

Before going to production:

```bash
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

Use Sandbox credentials and test thoroughly.

### 2. Switch to Production

Once sandbox testing is complete:

```bash
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
```

Use Production credentials (requires KYC).

## Verification Steps

### Step 1: Check KYC Status

1. Log in to https://merchant.cashfree.com/
2. Check if you see a banner about KYC
3. If KYC is pending, complete it
4. If approved, proceed to next step

### Step 2: Get Production Credentials

1. Go to **Developers** → **API Keys**
2. Click **Production** tab
3. If you see credentials, KYC is approved ✅
4. If you don't see production credentials, KYC is pending ⏳

### Step 3: Update Deployment

1. Go to your deployment platform
2. Update `CASHFREE_APP_ID` with production App ID
3. Update `CASHFREE_SECRET_KEY` with production Secret Key
4. Verify both environment variables are set to `production`
5. Save and redeploy

### Step 4: Test Diagnostic

Visit: `https://your-site.com/api/cashfree/diagnose`

**Success looks like:**
```json
{
  "orderCreationTest": "SUCCESS",
  "testOrder": {
    "payment_session_id": "PRESENT (prefix: session_...)",
    "environment_detected": "PRODUCTION"
  }
}
```

**Failure looks like:**
```json
{
  "orderCreationTest": "FAILED",
  "orderError": {
    "message": "Authentication failed"
  }
}
```

If failed, you're either:
- Using sandbox credentials in production mode
- KYC not completed
- Wrong credentials

### Step 5: Test Payment

1. Clear browser cache
2. Go to pricing page
3. Try to purchase a plan
4. Should open Cashfree checkout in **production mode**
5. Use a real payment method (⚠️ this will charge!)

## Important Notes for Production

### ⚠️ Real Money Transactions

- Production mode processes **REAL payments**
- Test thoroughly in sandbox first
- Small amounts for initial production testing
- Monitor transactions in Cashfree dashboard

### 🔒 Security

- Keep production credentials secure
- Never commit production keys to git
- Use environment variables only
- Rotate keys periodically

### 📊 Monitoring

After going live:
1. Monitor Cashfree dashboard for transactions
2. Check webhook logs
3. Monitor server logs for errors
4. Set up alerts for payment failures

## Sandbox vs Production

| Feature | Sandbox | Production |
|---------|---------|------------|
| Real money | ❌ No | ✅ Yes |
| KYC required | ❌ No | ✅ Yes |
| Test payments | ✅ Yes | ❌ No |
| Credentials | Immediate | After KYC approval |
| Payment session prefix | `session_sandbox_` | `session_` |

## What If KYC Is Not Approved Yet?

### Option 1: Use Sandbox Mode (Recommended)

Switch to sandbox for testing:

```bash
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```

Use your sandbox credentials. No KYC needed!

### Option 2: Wait for KYC Approval

1. Complete KYC submission
2. Wait for Cashfree approval (1-2 business days)
3. Get production credentials
4. Then switch to production

## Quick Command Reference

```bash
# Test local environment
node verify-env.js

# Should show:
# ✅ Cashfree environments match: production
```

## Need Help?

### Check Your Current Status

1. Visit `/api/cashfree/diagnose` on your deployed site
2. Look at the `orderCreationTest` result
3. Check `environment_detected` value

### Common Error Messages

**"Authentication failed"**
- Wrong credentials for your environment
- Using sandbox credentials with production mode
- KYC not approved yet

**"payment_session_id is not present"**
- API credentials are invalid
- Environment mismatch
- Check diagnostic endpoint output

**"Invalid credentials"**
- Wrong App ID or Secret Key
- Credentials don't match environment
- Verify you copied from correct tab (Production vs Sandbox)

## Summary

✅ **You've set production mode correctly**

Now you need to:
1. ✅ Complete KYC with Cashfree (if not done)
2. ✅ Get production credentials (after KYC approval)
3. ✅ Update your deployment with production credentials
4. ✅ Test with `/api/cashfree/diagnose`
5. ✅ Test actual payment flow

**If KYC is not done yet:** Consider using sandbox mode for testing until production credentials are available.

