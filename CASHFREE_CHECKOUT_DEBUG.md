# Cashfree Checkout Debugging Guide

## Current Issue

Order is being created successfully, but when redirecting to Cashfree checkout:
- ✅ Order creation: SUCCESS
- ✅ Payment session ID generated: `session_HhT1EeXvVfwy`
- ❌ Redirect URL missing session_id parameter

**Problem URL:**
```
https://api.cashfree.com/pg/view/sessions/checkout
```

**Should be:**
```
https://api.cashfree.com/pg/view/sessions/checkout?session_id=session_HhT1EeXvVfwy
```

## What I've Added

### Enhanced Logging

Added comprehensive logging to trace the exact issue:

```typescript
[Cashfree Checkout] Starting with session ID: session_...
[Cashfree Checkout] Mode: production
[Cashfree Checkout] Instance created
[Cashfree Checkout] Available methods: [...]
[Cashfree Checkout] Using launch type: redirect/checkout
[Cashfree Checkout] Payment session ID to pass: session_...
[Cashfree Checkout] Calling redirect with config: {...}
```

### SDK Compatibility Fix

Added support for both parameter name formats:

```typescript
const checkoutConfig = {
  paymentSessionId: paymentSessionId,  // camelCase (newer SDK)
  session_id: paymentSessionId,         // snake_case (older SDK)
  redirectTarget: '_self',
}
```

This handles different Cashfree SDK versions that might use different parameter names.

## Testing After Deployment

### Step 1: Deploy the Changes

```bash
git add .
git commit -m "Add enhanced Cashfree checkout logging and SDK compatibility"
git push origin main
```

### Step 2: Test Payment Flow

1. **Open browser console** (F12) BEFORE starting
2. Go to pricing page
3. Click "Upgrade Now" on any plan
4. **Watch the console logs** carefully

### Step 3: Check Console Logs

You should see these logs in order:

```
Creating order for plan: basic
Order creation response: {success: true, order: {...}}

[Cashfree Checkout] Starting with session ID: session_HhT1EeXvVfwy...
[Cashfree Checkout] Mode: production
[Cashfree Checkout] Instance created (method 1 or 2)
[Cashfree Checkout] Available methods: [redirect, checkout, ...]
[Cashfree Checkout] Using launch type: redirect (or checkout)
[Cashfree Checkout] Payment session ID to pass: session_HhT1EeXvVfwy...
[Cashfree Checkout] Calling redirect with config: {
  paymentSessionId: "session_...",
  session_id: "session_...",
  redirectTarget: "_self"
}
```

### Step 4: Identify the Issue

Based on the logs, we can identify:

#### Scenario A: SDK Not Loading
```
Error: Cashfree SDK not available
```
**Solution:** Check if SDK script is being blocked or failed to load

#### Scenario B: Wrong SDK Method
```
[Cashfree Checkout] Available methods: [...]
```
**Check:** Does it show `redirect` or `checkout` in the methods list?

#### Scenario C: Parameter Name Issue
```
[Cashfree Checkout] Calling redirect with config: {...}
```
**Check:** Are both `paymentSessionId` and `session_id` being passed?

#### Scenario D: Redirect Happening Without Session ID
If you still get redirected to the error page, it means the SDK is not accepting our session ID.

## Possible Root Causes & Solutions

### Issue 1: SDK Version Mismatch

**Check:** The SDK URL in console network tab
- Production: `https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js`
- Sandbox: `https://sdk.cashfree.com/js/ui/2.0.0/cashfree.sandbox.js`

**Solution:** If using v2 SDK, we might need to update the implementation

### Issue 2: Wrong Integration Method

Cashfree has multiple integration types:
- **Redirect:** Full page redirect to Cashfree checkout
- **Checkout:** Modal/iframe within your site
- **Drop:** Pre-built checkout form
- **Elements:** Custom form elements

**Check logs to see:** Which type is being used

### Issue 3: CSP (Content Security Policy) Blocking

**Symptom:** SDK loads but functions don't work

**Solution:** Check browser console for CSP errors

## Alternative Approach: Manual Redirect

If the SDK approach continues to fail, we can try a manual redirect:

```typescript
// Fallback: Manual redirect to Cashfree checkout
const checkoutUrl = `https://payments${
  mode === 'production' ? '' : '.sandbox'
}.cashfree.com/order/#${paymentSessionId}`

window.location.href = checkoutUrl
```

## Testing Checklist

After deploying:

- [ ] Open incognito window (fresh session)
- [ ] Open browser console (F12)
- [ ] Go to pricing page
- [ ] Click "Upgrade Now"
- [ ] Check console for all [Cashfree Checkout] logs
- [ ] Note the "Available methods" logged
- [ ] Note the "Using launch type" logged
- [ ] Note the exact config being passed
- [ ] Check if redirect URL includes session_id parameter

## Expected Behavior After Fix

1. User clicks "Upgrade Now"
2. Order created successfully ✅
3. Cashfree SDK loads ✅
4. SDK initialized with correct mode ✅
5. Payment session ID passed to SDK ✅
6. Redirect to Cashfree checkout WITH session_id in URL ✅
7. Cashfree checkout page loads successfully ✅
8. User can complete payment ✅

## Debug Information to Collect

If issue persists, collect:

1. **Console logs** - All [Cashfree Checkout] prefixed logs
2. **Network tab** - Check the SDK script request
3. **Order creation response** - Full JSON response
4. **Redirect URL** - Exact URL you're being redirected to
5. **Browser/Device** - Which browser and version

## Next Steps Based on Logs

### If logs show "Available methods: []"
→ SDK loaded but no methods available
→ Wrong SDK version or initialization issue

### If logs show correct methods but still fails
→ Parameter name issue
→ Try manual redirect approach

### If logs stop after "Instance created"
→ SDK initialization hanging
→ Check for JavaScript errors

### If redirect URL has session_id
→ Issue is with the session_id itself
→ Check order creation response for valid session_id

## Quick Reference

| Log Message | What It Means |
|------------|---------------|
| Starting with session ID | Payment session ID received from backend |
| Mode: production | SDK mode is correctly set |
| Instance created | Cashfree SDK initialized |
| Available methods: [...] | Which SDK methods are available |
| Using launch type: redirect | Using redirect method |
| Calling redirect with config | About to call SDK redirect |

## Manual Testing Command

To test SDK availability, run this in browser console on your site:

```javascript
// Check if Cashfree SDK is loaded
console.log('Cashfree available:', typeof window.Cashfree !== 'undefined')

// Check SDK mode
console.log('Environment:', process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT)

// Check what Cashfree object contains
if (window.Cashfree) {
  console.log('Cashfree object:', window.Cashfree)
}
```

## Support

If issue persists after checking all above:
1. Share complete console logs
2. Share network tab screenshot
3. Share the redirect URL you're getting
4. We'll switch to manual redirect approach or check SDK version compatibility

