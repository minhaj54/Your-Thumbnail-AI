# Live Cashfree Setup Guide

Follow these steps to launch Cashfree payments in production for ThumbnailAI.

## Prerequisites

- Active Cashfree merchant account with PG access
- Production domain with HTTPS
- Supabase project configured and deployed

## Step 1: Enable Production Credentials

1. Log in to the [Cashfree dashboard](https://merchant.cashfree.com/merchant/login).
2. Switch to **Production** mode.
3. Navigate to **Developer → Credentials**.
4. Generate App ID and Secret Key. Store them securely.

## Step 2: Configure Environment Variables

Update your production environment (e.g., Vercel):

```env
CASHFREE_APP_ID="cf_prod_app_id"
CASHFREE_SECRET_KEY="cf_prod_secret"
CASHFREE_ENVIRONMENT="production"
CASHFREE_DEFAULT_CUSTOMER_PHONE="9999999999"
NEXT_PUBLIC_CASHFREE_ENVIRONMENT="production"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

Deploy after updating the variables.

## Step 3: Set Up Webhook

1. In the Cashfree dashboard, go to **Developer → Webhooks**.
2. Add endpoint: `https://yourdomain.com/api/cashfree/webhook`
3. Enable events:
   - `PAYMENT_SUCCESS`
   - `PAYMENT_FAILED`
4. Save changes.

## Step 4: Verify Connectivity

Run the diagnostics route from your deployment:

```
https://yourdomain.com/api/test-cashfree
```

You should receive `{ "success": true, "environment": "PRODUCTION" }`.

## Step 5: Perform Live Test Transaction

1. Deploy the latest code with Cashfree integration.
2. Sign in with a test account.
3. Purchase the Basic plan with a small amount (e.g., ₹1).
4. Confirm:
   - Checkout completes successfully.
   - Credits are added in Supabase.
   - Subscription row status is `completed`.
   - Payment entry recorded in `payments`.

## Troubleshooting

- **401 Unauthorized**: Ensure Supabase session persists in production.
- **Order not completing**: Check Cashfree dashboard → Orders for status.
- **Webhook not triggered**: Verify endpoint reachable over HTTPS and events enabled.
- **Credits not added**: Inspect server logs for Supabase RPC errors.

## Monitoring

- Use Cashfree dashboard for payment analytics and disputes.
- Review Supabase `subscriptions` and `payments` tables regularly.
- Rotate Cashfree keys periodically and update environment variables.

Your Cashfree integration is now live! 🎉


