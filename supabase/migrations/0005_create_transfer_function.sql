-- Buat Fungsi Transfer Internal yang Aman
-- Fungsi ini akan menangani pemindahan dana antar dompet secara transaksional.

CREATE OR REPLACE FUNCTION public.create_transfer(
  from_id UUID,
  to_id UUID,
  amount_to_transfer NUMERIC,
  submission_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  sender_balance NUMERIC;
BEGIN
  -- 1. Dapatkan saldo pengirim dan kunci baris untuk pembaruan
  SELECT balance INTO sender_balance FROM wallets WHERE id = from_id FOR UPDATE;

  -- 2. Periksa apakah saldo mencukupi
  IF sender_balance IS NULL OR sender_balance < amount_to_transfer THEN
    RAISE EXCEPTION 'Saldo tidak mencukupi untuk melakukan transfer.';
  END IF;

  -- 3. Kurangi saldo pengirim
  UPDATE wallets
  SET balance = balance - amount_to_transfer
  WHERE id = from_id;

  -- 4. Tambah saldo penerima
  UPDATE wallets
  SET balance = balance + amount_to_transfer
  WHERE id = to_id;

  -- 5. Catat transaksi pembayaran
  INSERT INTO transactions (from_wallet_id, to_wallet_id, amount, type, status, related_submission_id)
  VALUES (from_id, to_id, amount_to_transfer, 'payment', 'completed', submission_id);

  -- (Opsional) Catat biaya platform jika ada
  -- DECLARE fee_amount NUMERIC := amount_to_transfer * 0.10; -- Asumsi biaya 10%
  -- UPDATE wallets SET balance = balance - fee_amount WHERE id = to_id;
  -- INSERT INTO transactions (to_wallet_id, amount, type, status)
  -- VALUES (to_id, fee_amount, 'fee', 'completed');

END;
$$;