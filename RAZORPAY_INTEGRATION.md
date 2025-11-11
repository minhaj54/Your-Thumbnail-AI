# Legacy Notice

> ⚠️ **Razorpay documentation has been deprecated.**  
> Cashfree is now the active payment provider. See `CASHFREE_INTEGRATION.md` for the current setup.

# Razorpay Payment Integration

## Overview
Complete Razorpay payment integration for the ThumbnailAI platform with support for subscription plans and pay-as-you-go credits.

## Features
- ✅ Subscription plan payments (Basic, Pro, Business)
- ✅ Pay-as-you-go credit purchases
- ✅ Payment verification and signature validation
- ✅ Automatic credit allocation
- ✅ Webhook support for payment events
- ✅ Secure payment handling with Supabase
- ✅ Live production mode support

## Environment Variables

### For Production (Live Mode)

Add these to your `.env.local` or `.env.production` file:

```env
# Razorpay Live Keys (Production)
# Get these from: https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID="rzp_live_xxxxx"
RAZORPAY_KEY_SECRET="your-live-secret-key"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_xxxxx"

# App Configuration
NEXT_PUBLIC_APP_URL="https://yourthumbnail.com"
```

### For Development (Test Mode)

```env
# Razorpay Test Keys
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="your-test-secret-key"
RAZORPAY_WEBHOOK_SECRET="your-test-webhook-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxx"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

⚠️ **Important**: Never commit live API keys to version control. Always use environment variables.

## Pricing Structure

1. **Free**: 3 credits/month - ₹0
2. **Basic**: 40 credits/month - ₹499
3. **Pro**: 150 credits/month - ₹1,499
4. **Business**: 350 credits/month - ₹3,999
5. **Pay As You Go**: Additional credits at ₹10 each

## Credit System

- **1 thumbnail generation = 1 credit**
- Credits are added to the user's account after successful payment
- No credit expiry for purchased credits
- Monthly subscription credits reset at billing cycle

## API Endpoints

### 1. Create Order (`/api/razorpay/create-order`)
Creates a Razorpay order and subscription record.

**Request:**
```json
{
  "planType": "basic" // or "pro", "business"
}
```

**Or for Pay As You Go:**
```json
{
  "isPayAsYouGo": true,
  "credits": 10
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxxxx",
    "amount": 49900,
    "currency": "INR",
    "key": "rzp_live_xxxxx"
  }
}
```

### 2. Verify Payment (`/api/razorpay/verify-payment`)
Verifies payment signature and adds credits to user account.

**Request:**
```json
{
  "orderId": "order_xxxxx",
  "paymentId": "pay_xxxxx",
  "signature": "signature_xxxxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "credits": 40
}
```

### 3. Webhook (`/api/razorpay/webhook`)
Handles Razorpay payment events (payment.captured, payment.authorized).

**Webhook URL for Production**: `https://yourthumbnail.com/api/razorpay/webhook`

## Production Setup Guide

### Step 1: Get Live API Keys

1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **API Keys**
3. Switch to **Live Mode** (toggle at top right)
4. Generate or copy your **Live Key ID** and **Live Key Secret**
5. Add them to your environment variables

### Step 2: Configure Webhook

1. In Razorpay Dashboard, go to **Settings** → **Webhooks**
2. Click **Add New Webhook**
3. Enter webhook URL: `https://yourthumbnail.com/api/razorpay/webhook`
4. Select events to subscribe:
   - `payment.captured`
   - `payment.authorized`
   - `payment.failed` (optional, for handling failures)
5. Save the webhook and copy the **Webhook Secret**
6. Add `RAZORPAY_WEBHOOK_SECRET` to your environment variables

### Step 3: Update Environment Variables

Update your production environment variables with:
- Live Key ID (`rzp_live_xxxxx`)
- Live Key Secret
- Webhook Secret
- Production URL (`https://yourthumbnail.com`)

### Step 4: Deploy and Test

1. Deploy your application with updated environment variables
2. Test with a small amount first (e.g., 10 credits = ₹100)
3. Monitor webhook delivery in Razorpay Dashboard
4. Verify credits are added to user accounts in Supabase

## Database Schema Updates

The integration uses the existing Supabase tables:

- **users**: Stores user credits and subscription tier
- **subscriptions**: Tracks subscription orders and status
- **payments**: Records completed payment transactions

### Key SQL Functions

1. **add_user_credits(user_id, credits_to_add)**: Adds credits to user account
2. **deduct_user_credits(user_id, credits_to_deduct)**: Deducts credits from user account

## Implementation Details

### Files Created

1. `src/lib/razorpay.ts` - Razorpay configuration and utilities
2. `src/lib/payment-handler.ts` - Frontend payment handling
3. `src/app/api/razorpay/create-order/route.ts` - Order creation API
4. `src/app/api/razorpay/verify-payment/route.ts` - Payment verification API
5. `src/app/api/razorpay/webhook/route.ts` - Webhook handler

### Updated Files

1. `src/app/pricing/page.tsx` - Integrated payment flow
2. `supabase/migrations/001_initial_schema.sql` - Updated default credits to 5
3. `supabase/migrations/002_add_pricing_functions.sql` - Added credit management functions

## Payment Flow

1. **User clicks "Upgrade" or "Buy Credits"**
   - Frontend calls `/api/razorpay/create-order`
   - API creates Razorpay order and subscription record

2. **Razorpay Checkout opens**
   - User enters payment details
   - Payment is processed by Razorpay

3. **Payment Success**
   - Frontend calls `/api/razorpay/verify-payment`
   - API verifies payment signature
   - Credits are added to user account
   - User is redirected to dashboard

4. **Webhook Confirmation**
   - Razorpay sends webhook event
   - System verifies and processes the event
   - Additional credit allocation as safety measure

## Security

- ✅ Payment signature verification
- ✅ Webhook signature validation
- ✅ Row Level Security (RLS) on all database tables
- ✅ Authenticated API endpoints
- ✅ Secure environment variables
- ✅ HTTPS required for production webhooks
- ✅ No sensitive data in client-side code

## Testing

### Test Mode
Use Razorpay test credentials:
- Test cards: https://razorpay.com/docs/payments/test-cards/
- UPI Test IDs: test@razorpay, success@razorpay
- Net Banking: Test credentials available in dashboard

### Live Mode Testing
1. Start with small test transactions (₹100-₹500)
2. Verify payment appears in Razorpay Dashboard
3. Check webhook delivery status
4. Verify credits are added correctly
5. Monitor database for proper record creation

## Production Deployment Checklist

- [ ] Live API keys configured in environment variables
- [ ] Webhook URL configured in Razorpay Dashboard
- [ ] Webhook secret added to environment variables
- [ ] Production URL set in `NEXT_PUBLIC_APP_URL`
- [ ] HTTPS enabled for webhook endpoint
- [ ] Database migrations applied
- [ ] Payment flow tested with real transactions
- [ ] Webhook events verified in dashboard
- [ ] Error handling and logging verified

## Troubleshooting

### Payment not completing
- Check if Razorpay script is loading
- Verify API keys are correct (live vs test mode)
- Check browser console for errors
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` matches `RAZORPAY_KEY_ID`

### Credits not added
- Check database logs
- Verify webhook is configured and receiving events
- Check `add_user_credits` function exists
- Review Razorpay Dashboard for payment status

### Webhook not working
- Verify webhook URL is accessible: `https://yourthumbnail.com/api/razorpay/webhook`
- Check webhook secret matches in environment and Razorpay Dashboard
- Review Razorpay dashboard for webhook delivery status
- Check server logs for webhook errors
- Ensure HTTPS is enabled (webhooks require HTTPS)

### Invalid signature errors
- Verify `RAZORPAY_WEBHOOK_SECRET` matches the one in Razorpay Dashboard
- Check that you're using the correct key (test vs live)
- Ensure webhook payload is not modified before verification

