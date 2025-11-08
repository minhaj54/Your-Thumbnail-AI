# Update Your Subscription Tier Manually

If your profile is showing "Free" but you've purchased a Pro plan, you can update it manually:

## Option 1: Update via SQL (Recommended)

1. Go to your Supabase Dashboard
2. Open SQL Editor
3. Run this query (replace the user ID with your actual user ID):

```sql
-- Find your user ID
SELECT id, email, subscription_tier FROM users WHERE email = 'your-email@example.com';

-- Update your tier to pro
UPDATE users 
SET subscription_tier = 'pro' 
WHERE id = 'your-user-id-here';
```

## Option 2: Update via API

You can also call the update API endpoint directly:

```bash
curl -X POST http://localhost:3000/api/user/update-tier \
  -H "Content-Type: application/json" \
  -d '{"subscription_tier": "pro"}'
```

## After Updating

1. Refresh your profile page
2. You should now see "Pro" as your subscription tier
3. Your credits should match your plan

## Future Payments

Going forward, the subscription tier will update automatically when you make a new payment through the pricing page.

