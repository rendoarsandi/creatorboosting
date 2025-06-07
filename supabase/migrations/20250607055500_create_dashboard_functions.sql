-- Fungsi untuk mendapatkan statistik ringkasan untuk seorang kreator
CREATE OR REPLACE FUNCTION public.get_creator_stats(creator_id_param UUID)
RETURNS TABLE (
    total_revenue NUMERIC,
    sales_last_30_days BIGINT,
    total_products BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COALESCE(SUM(s.amount), 0)
         FROM public.sales s
         JOIN public.products p ON s.product_id = p.id
         WHERE p.creator_id = creator_id_param) AS total_revenue,

        (SELECT COUNT(*)
         FROM public.sales s
         JOIN public.products p ON s.product_id = p.id
         WHERE p.creator_id = creator_id_param AND s.sale_date >= NOW() - INTERVAL '30 days') AS sales_last_30_days,

        (SELECT COUNT(*)
         FROM public.products p
         WHERE p.creator_id = creator_id_param) AS total_products;
END;
$$ LANGUAGE plpgsql;

-- Fungsi untuk mendapatkan data penjualan harian selama 30 hari terakhir
CREATE OR REPLACE FUNCTION public.get_creator_sales_last_30_days(creator_id_param UUID)
RETURNS TABLE (
    date TEXT,
    total_sales NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT generate_series(
            (NOW() - INTERVAL '29 days')::date,
            NOW()::date,
            '1 day'::interval
        )::date AS sale_day
    )
    SELECT
        to_char(ds.sale_day, 'YYYY-MM-DD') AS date,
        COALESCE(SUM(s.amount), 0) AS total_sales
    FROM date_series ds
    LEFT JOIN public.sales s ON s.sale_date::date = ds.sale_day
    LEFT JOIN public.products p ON s.product_id = p.id AND p.creator_id = creator_id_param
    GROUP BY ds.sale_day
    ORDER BY ds.sale_day;
END;
$$ LANGUAGE plpgsql;