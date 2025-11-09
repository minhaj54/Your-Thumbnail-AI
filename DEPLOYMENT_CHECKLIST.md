# Deployment Checklist - Cashfree Payment Fix

## Before Deploying

- [ ] Verify local environment with: `node verify-env.js`
- [ ] All local tests pass
- [ ] Commit and push changes

## On Deployment Platform

### Environment Variables to Set:

#### Cashfree (Required)
- [ ] `CASHFREE_APP_ID` - Your Cashfree App ID
- [ ] `CASHFREE_SECRET_KEY` - Your Cashfree Secret Key  
- [ ] `CASHFREE_ENVIRONMENT` - `sandbox` or `production`
- [ ] `CASHFREE_DEFAULT_CUSTOMER_PHONE` - e.g., `9999999999`
- [ ] `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` - **MUST MATCH CASHFREE_ENVIRONMENT**

#### App Configuration (Required)
- [ ] `NEXT_PUBLIC_APP_URL` - Your deployed URL (no trailing slash)

#### Supabase (Required)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

#### Other (Required)
- [ ] `GOOGLE_API_KEY`

### Deploy
- [ ] Save environment variables
- [ ] Trigger deployment
- [ ] Wait for deployment to complete

## After Deployment

### 1. Test Diagnostic Endpoint
- [ ] Visit: `https://your-site.com/api/cashfree/diagnose`
- [ ] Check response shows `"orderCreationTest": "SUCCESS"`
- [ ] Check all environment variables show as "SET"
- [ ] Verify `environment_detected` matches your CASHFREE_ENVIRONMENT

### 2. Test Payment Flow
- [ ] Clear browser cache
- [ ] Go to pricing page
- [ ] Open browser console (F12)
- [ ] Try to purchase a plan
- [ ] Verify Cashfree checkout opens
- [ ] Complete a test payment (in sandbox)

### 3. Check Logs
- [ ] Review server logs for any errors
- [ ] Look for `[Cashfree]` prefixed logs
- [ ] Verify no environment mismatch warnings

## Common Issues & Quick Fixes

### Issue: Diagnostic shows "NOT_SET"
**Fix:** Add the missing environment variable and redeploy

### Issue: orderCreationTest shows "FAILED"
**Fix:** Check Cashfree credentials are correct for your environment

### Issue: Environment mismatch
**Fix:** Ensure `CASHFREE_ENVIRONMENT` and `NEXT_PUBLIC_CASHFREE_ENVIRONMENT` are identical

### Issue: Payment checkout doesn't open
**Fix:** Clear browser cache, check console for errors

## Sandbox vs Production

### For Testing (Sandbox):
```
CASHFREE_ENVIRONMENT=sandbox
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=sandbox
```
Use Sandbox credentials from Cashfree dashboard

### For Live (Production):
```
CASHFREE_ENVIRONMENT=production
NEXT_PUBLIC_CASHFREE_ENVIRONMENT=production
```
- Complete KYC in Cashfree dashboard
- Use Production credentials
- Test thoroughly in sandbox first!

## Success Indicators

✅ Diagnostic endpoint returns SUCCESS
✅ All environment variables show as "SET"
✅ Environments match (sandbox/sandbox or production/production)
✅ Cashfree checkout modal opens when clicking "Upgrade"
✅ Test payment completes successfully
✅ Credits are added to user account
✅ No errors in browser console or server logs

## If Still Not Working

1. Share diagnostic endpoint output
2. Share browser console logs
3. Share server logs showing the [Cashfree] error
4. Check `PAYMENT_DEBUG_GUIDE.md` for detailed troubleshooting

---

**Remember:** After setting/changing environment variables, always redeploy your application!

