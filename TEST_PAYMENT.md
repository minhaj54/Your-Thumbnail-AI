# Testing Payment Integration

## Steps to Debug Payment Issue

1. **Open browser console** and click the upgrade button
2. **Check for these console logs:**
   - "Creating order for plan: basic"
   - "Order creation response: {...}"
   - "Loading Cashfree script..."
   - "Cashfree checkout initiated"
   - "Cashfree payment failed:" (only on error)

## Common Issues

### Issue 1: "Failed to create order"
**Solution**: Check that `.env.local` has these variables:
```
CASHFREE_APP_ID="cf_app_id"
CASHFREE_SECRET_KEY="cf_secret_key"
CASHFREE_ENVIRONMENT="sandbox"
NEXT_PUBLIC_CASHFREE_ENVIRONMENT="sandbox"
```

### Issue 2: Cashfree script not loading
**Solution**: Check network tab in browser DevTools for sdk.cashfree.com

### Issue 3: Checkout opens but no payment method shows
**Solution**: Make sure sandbox keys are active and the order amount is ≥ ₹1.00 in Cashfree dashboard

## Manual Test Steps

1. Click "Upgrade Now" on any plan
2. Check browser console for errors
3. If no errors, Cashfree checkout should open
4. Use Cashfree sandbox card: `4111111111111111`
5. Use any future expiry date
6. Use any CVV
7. Enter any name

## Check Environment Variables

Run this in terminal:
```bash
cat .env.local | grep CASHFREE
```

Should show:
- CASHFREE_APP_ID
- CASHFREE_SECRET_KEY
- CASHFREE_ENVIRONMENT
- NEXT_PUBLIC_CASHFREE_ENVIRONMENT

