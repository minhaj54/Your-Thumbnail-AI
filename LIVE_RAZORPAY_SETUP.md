# Legacy Notice

> ⚠️ **Razorpay setup is now legacy.**  
> Use `LIVE_CASHFREE_SETUP.md` for the current Cashfree deployment guide.

# Live Razorpay Setup Guide

This guide will walk you through setting up Razorpay in live production mode for your ThumbnailAI application.

## Prerequisites

- Active Razorpay account
- Access to Razorpay Dashboard (https://dashboard.razorpay.com/)
- Deployed application at `https://yourthumbnail.com`
- Access to your deployment platform's environment variables

## Step 1: Activate Live Mode in Razorpay

1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Look for the mode toggle in the top right corner (should show "Test Mode" or "Live Mode")
3. Click to switch to **Live Mode**
4. Complete any required KYC verification if prompted

## Step 2: Get Your Live API Keys

1. In Razorpay Dashboard, navigate to **Settings** → **API Keys**
2. Ensure you're in **Live Mode** (check the toggle at top)
3. You'll see your **Key ID** (starts with `rzp_live_`)
4. Click **Reveal Secret Key** or **Generate New Key** if you don't have one
5. **Important**: Copy both keys immediately - the secret key won't be shown again!

   - **Key ID**: `rzp_live_xxxxxxxxxxxxx`
   - **Secret Key**: `xxxxxxxxxxxxxxxxxxxxx` (keep this secure!)

## Step 3: Configure Webhook

### 3.1 Create Webhook in Razorpay Dashboard

1. Navigate to **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. Enter your webhook URL:
   ```
   https://yourthumbnail.com/api/razorpay/webhook
   ```
4. Select the following events (checkboxes):
   - ✅ `payment.captured` (Required)
   - ✅ `payment.authorized` (Required)
   - ✅ `payment.failed` (Recommended)
5. Click **Save**
6. **Copy the Webhook Secret** - this will be shown only once!

### 3.2 Verify Webhook Configuration

After saving, Razorpay will show:
- Webhook URL
- Webhook Secret (save this!)
- Active status
- Event subscriptions

## Step 4: Update Environment Variables

### 4.1 For Vercel/Netlify Deployment

1. Go to your deployment platform's dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add or update the following variables:

   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_live_secret_key_here
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   NEXT_PUBLIC_APP_URL=https://yourthumbnail.com
   ```

4. Ensure these are set for **Production** environment
5. Redeploy your application after adding variables

### 4.2 For Local Development (Optional)

If you want to test locally with live keys (not recommended for testing):

1. Create `.env.local` file in your project root
2. Add the same environment variables as above
3. ⚠️ **Never commit this file to git!** It's already in `.gitignore`

### 4.3 Verify Environment Variables

After deployment, verify the variables are loaded:
- Check your deployment logs for any Razorpay initialization errors
- Ensure `NEXT_PUBLIC_RAZORPAY_KEY_ID` matches `RAZORPAY_KEY_ID` (both should be live keys)

## Step 5: Test the Integration

### 5.1 Test Webhook Delivery

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Find your webhook and click **Send Test Event** or **Test**
3. Check your server logs to confirm the webhook was received
4. Verify in Razorpay Dashboard that the delivery was successful

### 5.2 Test Payment Flow

1. **Start Small**: Test with the minimum amount (₹100 for 10 credits)
2. Go to your pricing page: `https://yourthumbnail.com/pricing`
3. Click "Buy 10 Credits" or select the Basic plan
4. Complete the payment using a real payment method
5. Verify:
   - Payment appears in Razorpay Dashboard under **Payments**
   - Credits are added to user account in your database
   - Webhook event was received (check Razorpay Dashboard → Webhooks → Events)

### 5.3 Verify Credit Allocation

1. Check your Supabase database:
   ```sql
   SELECT id, email, credits, subscription_tier 
   FROM users 
   WHERE email = 'test@example.com';
   ```
2. Check payment records:
   ```sql
   SELECT * FROM payments ORDER BY created_at DESC LIMIT 5;
   ```
3. Check subscription records:
   ```sql
   SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;
   ```

## Step 6: Monitor and Verify

### 6.1 Razorpay Dashboard Monitoring

- **Payments**: Monitor all incoming payments
- **Webhooks**: Check webhook delivery status and retry failed deliveries
- **Settlements**: View payment settlements and bank transfers
- **Reports**: Generate payment and transaction reports

### 6.2 Application Monitoring

- Check application logs for payment processing errors
- Monitor database for successful credit allocations
- Verify webhook processing in server logs

## Security Checklist

Before going fully live, ensure:

- [ ] Live API keys are stored only in environment variables (never in code)
- [ ] `.env.local` and `.env.production` are in `.gitignore`
- [ ] Webhook secret is configured and matches in both places
- [ ] HTTPS is enabled for your production domain
- [ ] Webhook endpoint is publicly accessible (no authentication required for Razorpay)
- [ ] Payment signature verification is working
- [ ] Webhook signature validation is implemented (already done in code)

## Common Issues and Solutions

### Issue: "Invalid API Key" Error

**Solution**:
- Verify you're using live keys, not test keys
- Check that `RAZORPAY_KEY_ID` and `NEXT_PUBLIC_RAZORPAY_KEY_ID` match
- Ensure no extra spaces in environment variables
- Redeploy application after updating environment variables

### Issue: Webhook Not Receiving Events

**Solution**:
- Verify webhook URL is correct: `https://yourthumbnail.com/api/razorpay/webhook`
- Check that HTTPS is enabled (webhooks require HTTPS)
- Verify webhook secret matches in environment and Razorpay Dashboard
- Check Razorpay Dashboard → Webhooks → Events for delivery status
- Review server logs for webhook processing errors

### Issue: Credits Not Added After Payment

**Solution**:
- Check Razorpay Dashboard to confirm payment was captured
- Verify webhook events are being received
- Check database logs for `add_user_credits` function errors
- Ensure subscription record was created with correct order ID
- Verify user authentication in payment verification endpoint

### Issue: Payment Signature Verification Fails

**Solution**:
- Ensure `RAZORPAY_KEY_SECRET` is correct
- Verify you're using the secret key (not the key ID)
- Check that order ID, payment ID, and signature match exactly
- Ensure no modifications to payment data before verification

## Production Best Practices

1. **Start Small**: Begin with small test transactions before processing large amounts
2. **Monitor Closely**: Watch the first few transactions carefully
3. **Set Up Alerts**: Configure alerts in Razorpay Dashboard for failed payments
4. **Regular Audits**: Periodically verify payment records match Razorpay Dashboard
5. **Backup Plan**: Have a manual process to add credits if webhooks fail
6. **Documentation**: Keep a record of your webhook secret and API keys in a secure password manager

## Support Resources

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Razorpay API Reference: https://razorpay.com/docs/api/
- Webhook Events: https://razorpay.com/docs/webhooks/

## Next Steps

After successful setup:
1. Test all payment flows (subscriptions and pay-as-you-go)
2. Monitor webhook delivery for 24-48 hours
3. Set up payment notifications/alerts
4. Document any custom payment flows
5. Prepare for scale (monitor performance as transactions increase)

---

**Need Help?** If you encounter issues, check the troubleshooting section in `RAZORPAY_INTEGRATION.md` or contact Razorpay support.
