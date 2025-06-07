-- 1. Buat tabel baru untuk marketplace
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id),
    sale_date TIMESTAMPTZ DEFAULT NOW(),
    amount NUMERIC(10, 2) NOT NULL
);

CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id),
    reviewer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Kebijakan RLS: Siapa pun dapat melihat produk, tetapi hanya kreator yang dapat mengelolanya.
CREATE POLICY "Public can view all products." ON public.products FOR SELECT USING (true);
CREATE POLICY "Creators can manage their own products." ON public.products FOR ALL USING (auth.uid() = creator_id);

-- Kebijakan RLS: Kreator dapat melihat penjualan produk mereka.
CREATE POLICY "Creators can view their product sales." ON public.sales FOR SELECT USING (
    auth.uid() = (SELECT creator_id FROM public.products WHERE id = product_id)
);

-- Kebijakan RLS: Siapa pun dapat melihat ulasan.
CREATE POLICY "Public can view all reviews." ON public.reviews FOR SELECT USING (true);