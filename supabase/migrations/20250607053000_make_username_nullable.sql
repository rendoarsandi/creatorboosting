-- Make the username column in the profiles table optional
ALTER TABLE public.profiles
ALTER COLUMN username DROP NOT NULL;

-- Also, modify the handle_new_user function to no longer insert a username,
-- as it might not be available in the user's metadata upon initial signup.
-- The user can set it later in their profile settings.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new profile without the username
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, (new.raw_user_meta_data->>'role')::user_role);
  
  -- Insert a new wallet for the user
  INSERT INTO public.wallets (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;