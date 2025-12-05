-- Fix critical security issue: Only admins can update reward settings
DROP POLICY IF EXISTS "Authenticated users can update reward settings" ON reward_settings;
CREATE POLICY "Only admins can update reward settings" ON reward_settings
FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));