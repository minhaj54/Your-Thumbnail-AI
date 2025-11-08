-- Add function to add credits to user
CREATE OR REPLACE FUNCTION public.add_user_credits(user_id UUID, credits_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET credits = credits + credits_to_add
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add function to deduct credits from user
CREATE OR REPLACE FUNCTION public.deduct_user_credits(user_id UUID, credits_to_deduct INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  current_credits INTEGER;
BEGIN
  -- Get current credits
  SELECT credits INTO current_credits
  FROM public.users
  WHERE id = user_id;

  -- Check if user has enough credits
  IF current_credits >= credits_to_deduct THEN
    -- Deduct credits
    UPDATE public.users
    SET credits = credits - credits_to_deduct
    WHERE id = user_id;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update subscription_tier enum to include business
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_subscription_tier_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_subscription_tier_check 
CHECK (subscription_tier IN ('free', 'basic', 'pro', 'business', 'custom'));

-- Update subscriptions plan_type to include business
ALTER TABLE public.subscriptions 
DROP CONSTRAINT IF EXISTS subscriptions_plan_type_check;

ALTER TABLE public.subscriptions 
ADD CONSTRAINT subscriptions_plan_type_check 
CHECK (plan_type IN ('free', 'basic', 'pro', 'business', 'custom'));

