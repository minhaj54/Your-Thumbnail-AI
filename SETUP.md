# Thumbnail Builder SaaS - Setup Instructions

## Prerequisites

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **Supabase Account** - Sign up at [supabase.com](https://supabase.com/)
3. **Razorpay Account** - Sign up at [razorpay.com](https://razorpay.com/)
4. **Google Gemini API Key** - Get from [Google AI Studio](https://aistudio.google.com/)

## Setup Steps

### 1. Supabase Setup

1. Create a new Supabase project
2. Go to Settings > API to get your project URL and anon key
3. Go to Settings > Database to get your service role key
4. Run the SQL migration from `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
5. Go to Storage and create a bucket named `thumbnails` (public)

### 2. Razorpay Setup

1. Create a Razorpay account and get your test API keys
2. Set up webhook endpoint: `https://yourdomain.com/api/razorpay/webhook`
3. Enable webhook events: `payment.captured`, `payment.failed`, `order.paid`

### 3. Environment Variables

Create a `.env.local` file in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Razorpay
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="your-secret-key"
RAZORPAY_WEBHOOK_SECRET="your-webhook-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxx"

# Google Gemini API
GOOGLE_API_KEY="your-gemini-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your SaaS application!

## Features Implemented

### ✅ Authentication System
- Supabase Auth integration
- Sign up with 3 free credits
- Sign in/sign out functionality
- Protected routes middleware

### ✅ Credit System
- Free tier: 3 thumbnail generations
- Credit tracking and deduction
- Upgrade modal when credits exhausted
- Credit display in UI

### ✅ Payment Integration
- Razorpay payment gateway
- Two pricing plans:
  - Basic: ₹415 → 40 credits
  - Pro: ₹1,660 → 160 credits
- Payment verification and webhook handling
- Automatic credit top-up after successful payment

### ✅ Image Storage
- Supabase Storage integration
- CDN URLs instead of base64
- Image metadata storage
- User-specific image organization

### ✅ Dashboard
- Real user data display
- Credit balance and subscription status
- Generated images gallery
- Image management (view, download, delete)

### ✅ Generation Features
- AI-powered thumbnail generation
- Face preservation technology
- Multiple styles and aspect ratios
- Credit checking before generation
- Error handling and user feedback

## Testing the Complete Flow

1. **Sign Up**: Create account → Get 3 free credits
2. **Generate**: Create thumbnails → Credits deducted
3. **Exhaust Credits**: Use all 3 credits → Upgrade modal appears
4. **Purchase**: Buy credits via Razorpay → Credits added
5. **Continue**: Generate more thumbnails

## Production Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production
- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Use production Razorpay keys
- Use production Supabase project
- Update webhook URL in Razorpay dashboard

## Database Schema

The application uses the following main tables:
- `users` - User profiles and credit balance
- `generations` - Generated images metadata
- `subscriptions` - Purchase records
- `payments` - Payment transaction records

## API Endpoints

- `POST /api/generate/image` - Generate thumbnail (requires credits)
- `POST /api/generate/face-preservation` - Generate with face preservation
- `GET /api/credits/balance` - Get user credits
- `POST /api/razorpay/create-order` - Create payment order
- `POST /api/razorpay/verify-payment` - Verify payment
- `POST /api/razorpay/webhook` - Handle Razorpay webhooks
- `GET /api/images/list` - Get user's generated images
- `DELETE /api/images/delete` - Delete image

## Security Features

- Row Level Security (RLS) on all tables
- User-specific data access
- Payment signature verification
- Webhook signature validation
- Protected API routes

## Support

For issues or questions:
1. Check the console logs for errors
2. Verify environment variables are set correctly
3. Ensure Supabase RLS policies are active
4. Check Razorpay webhook configuration

The SaaS application is now ready for production use! 🚀
