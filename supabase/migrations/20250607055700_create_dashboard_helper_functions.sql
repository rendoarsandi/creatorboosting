-- Fungsi untuk mendapatkan produk terlaris
CREATE OR REPLACE FUNCTION public.get_top_products(creator_id_param UUID)
RETURNS TABLE (
    name TEXT,
    count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.name,
        COUNT(s.id) as sale_count
    FROM public.sales s
    JOIN public.products p ON s.product_id = p.id
    WHERE p.creator_id = creator_id_param
    GROUP BY p.name
    ORDER BY sale_count DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Fungsi untuk mendapatkan penjualan terbaru
CREATE OR REPLACE FUNCTION public.get_recent_sales(creator_id_param UUID)
RETURNS TABLE (
    name TEXT,
    amount NUMERIC,
    sale_date TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.name,
        s.amount,
        s.sale_date
    FROM public.sales s
    JOIN public.products p ON s.product_id = p.id
    WHERE p.creator_id = creator_id_param
    ORDER BY s.sale_date DESC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;