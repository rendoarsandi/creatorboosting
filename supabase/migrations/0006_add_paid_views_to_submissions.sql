-- Menambahkan kolom untuk melacak views yang sudah dibayar
-- Ini penting untuk memastikan kita tidak membayar dua kali untuk views yang sama.

ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS views_paid_for BIGINT NOT NULL DEFAULT 0;

-- Tambahkan constraint untuk memastikan views yang dibayar tidak melebihi views yang terlacak
ALTER TABLE public.submissions
ADD CONSTRAINT views_paid_for_le_tracked_views
CHECK (views_paid_for <= tracked_views);
