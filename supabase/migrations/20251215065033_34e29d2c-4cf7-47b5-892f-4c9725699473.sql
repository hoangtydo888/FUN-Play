-- Fix 1: Create trigger to automatically update subscriber_count when subscriptions change
CREATE OR REPLACE FUNCTION public.update_channel_subscriber_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.channels
    SET subscriber_count = (
      SELECT COUNT(*) FROM public.subscriptions WHERE channel_id = NEW.channel_id
    )
    WHERE id = NEW.channel_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.channels
    SET subscriber_count = (
      SELECT COUNT(*) FROM public.subscriptions WHERE channel_id = OLD.channel_id
    )
    WHERE id = OLD.channel_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

-- Create trigger on subscriptions table
DROP TRIGGER IF EXISTS on_subscription_change ON public.subscriptions;
CREATE TRIGGER on_subscription_change
AFTER INSERT OR DELETE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_channel_subscriber_count();

-- Fix 2: Replace permissive reward_settings policy with admin-only policy
DROP POLICY IF EXISTS "Authenticated users can update reward settings" ON public.reward_settings;
DROP POLICY IF EXISTS "Only admins can update reward settings" ON public.reward_settings;

CREATE POLICY "Only admins can update reward settings"
ON public.reward_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));