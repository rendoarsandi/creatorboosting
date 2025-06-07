-- Drop existing objects to ensure a clean slate
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.performance_proofs CASCADE;
DROP TABLE IF EXISTS public.clicks CASCADE;
DROP TABLE IF EXISTS public.submissions CASCADE;
DROP TABLE IF EXISTS public.campaigns CASCADE;
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.wallets CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop ENUM types if they exist
DROP TYPE IF EXISTS submission_status;
DROP TYPE IF EXISTS campaign_status;
DROP TYPE IF EXISTS transaction_type;
DROP TYPE IF EXISTS transaction_status;
DROP TYPE IF EXISTS user_role;

-- Create ENUM types for roles and statuses
CREATE TYPE user_role AS ENUM ('creator', 'promoter');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'completed', 'archived');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'campaign_payment', 'payout');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wallets table
CREATE TABLE public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL REFERENCES public.wallets(id),
    amount NUMERIC(10, 2) NOT NULL,
    type transaction_type NOT NULL,
    status transaction_status NOT NULL DEFAULT 'pending',
    related_entity_id UUID, -- e.g., campaign_id or withdrawal_request_id
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    budget NUMERIC(10, 2) NOT NULL,
    target_clicks INT,
    cost_per_click NUMERIC(10, 4) GENERATED ALWAYS AS (budget / NULLIF(target_clicks, 0)) STORED,
    status campaign_status NOT NULL DEFAULT 'draft',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    campaign_materials_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create submissions table
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES public.campaigns(id),
    promoter_id UUID NOT NULL REFERENCES public.profiles(id),
    tracking_link_identifier TEXT UNIQUE NOT NULL,
    status submission_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(campaign_id, promoter_id)
);

-- Create clicks table
CREATE TABLE public.clicks (
    id BIGSERIAL PRIMARY KEY,
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create performance_proofs table
CREATE TABLE public.performance_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own wallet." ON public.wallets FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own transactions." ON public.transactions FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.wallets WHERE id = wallet_id));

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active campaigns." ON public.campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Creators can manage their own campaigns." ON public.campaigns FOR ALL USING (auth.uid() = creator_id);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can manage their own submissions." ON public.submissions FOR ALL USING (auth.uid() = promoter_id);
CREATE POLICY "Creators can view submissions to their campaigns." ON public.submissions FOR SELECT USING (auth.uid() = (SELECT creator_id FROM public.campaigns WHERE id = campaign_id));

ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to clicks" ON public.clicks FOR SELECT USING (true);

ALTER TABLE public.performance_proofs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promoters can manage their own proofs." ON public.performance_proofs FOR ALL USING (auth.uid() = (SELECT promoter_id FROM public.submissions WHERE id = submission_id));
CREATE POLICY "Creators can view proofs for their campaigns." ON public.performance_proofs FOR SELECT USING (auth.uid() = (SELECT creator_id FROM public.campaigns WHERE id = (SELECT campaign_id FROM public.submissions WHERE id = submission_id)));

-- Function to create a profile and wallet for a new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (new.id, new.raw_user_meta_data->>'username', (new.raw_user_meta_data->>'role')::user_role);
  
  INSERT INTO public.wallets (user_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();