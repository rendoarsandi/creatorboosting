CREATE TABLE public.app_meta (
    key TEXT PRIMARY KEY,
    value JSONB
);

ALTER TABLE public.app_meta ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.app_meta FOR SELECT USING (true);