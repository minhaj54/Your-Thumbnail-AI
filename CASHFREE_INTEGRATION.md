# Cashfree Payment Integration

This document explains how Cashfree is integrated with the ThumbnailAI platform for both subscription plans and pay-as-you-go credit purchases.

## Overview

- Server-side order creation via Cashfree PG SDK (`cashfree-pg`)
- Client-side checkout using Cashfree Web SDK v2
- Supabase used for user, subscription, and payment bookkeeping
- Webhook endpoint to reconcile asynchronous notifications

## Environment Variables

Add the following to `.env.local`:

```env
CASHFREE_APP_ID="cf_app_id"
CASHFREE_SECRET_KEY="cf_secret_key"
CASHFREE_ENVIRONMENT="sandbox" # set to production for live
CASHFREE_DEFAULT_CUSTOMER_PHONE="9999999999"
NEXT_PUBLIC_CASHFREE_ENVIRONMENT="sandbox"
```

## Data Flow

1. **Create Order** – `POST /api/cashfree/create-order`
   - Validates the plan or credit purchase request
   - Creates a Cashfree order and returns `paymentSessionId`
   - Inserts a pending subscription row in Supabase

2. **Checkout** – `openCashfreeCheckout()`
   - Loads the Cashfree SDK dynamically
   - Opens the Cashfree checkout with the session ID
   - On success, triggers verification API

3. **Verify Payment** – `POST /api/cashfree/verify-payment`
   - Fetches order/payment status from Cashfree
   - Updates subscription status, credits, and payment history

4. **Webhook** – `POST /api/cashfree/webhook`
   - Verifies webhook signature
  - Completes any pending subscription updates

## Key Files

- `src/lib/cashfree.ts` – Cashfree SDK helpers and pricing configuration
- `src/lib/payment-handler.ts` – Browser utilities for loading Cashfree SDK and opening checkout
- `src/app/api/cashfree/create-order/route.ts` – Order creation and subscription record
- `src/app/api/cashfree/verify-payment/route.ts` – Payment verification and credit top-up
- `src/app/api/cashfree/webhook/route.ts` – Webhook processing
- `src/app/pricing/page.tsx` – Client UI integrating with Cashfree checkout

## Webhook Setup

Configure the webhook URL in the Cashfree dashboard:

- URL: `https://yourdomain.com/api/cashfree/webhook`
- Events: `PAYMENT_SUCCESS`, `PAYMENT_FAILED`
- Secret: not required (signature handled by headers)

## Sandbox Testing

Use Cashfree sandbox payment details:

- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: `123456`

Monitor logs in the development terminal for `Cashfree` prefixed messages and verify database updates in Supabase.

## Go-Live Checklist

- [ ] Switch to production keys and set `CASHFREE_ENVIRONMENT=production`
- [ ] Update webhook endpoint in Cashfree dashboard to production domain
- [ ] Confirm CORS/HTTPS requirements are met
- [ ] Test live payment with minimal amount
- [ ] Archive Razorpay credentials from environment

Cashfree integration is now ready for testing and production use. 🚀


