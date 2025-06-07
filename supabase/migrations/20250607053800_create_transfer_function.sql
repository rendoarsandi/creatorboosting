CREATE OR REPLACE FUNCTION public.create_transfer(
    from_user_id UUID,
    to_user_id UUID,
    amount_to_transfer NUMERIC,
    transfer_type transaction_type,
    related_entity UUID DEFAULT NULL
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    from_wallet_id UUID;
    to_wallet_id UUID;
    from_balance NUMERIC;
BEGIN
    -- Dapatkan ID dompet dari ID pengguna
    SELECT id INTO from_wallet_id FROM public.wallets WHERE user_id = from_user_id;
    SELECT id INTO to_wallet_id FROM public.wallets WHERE user_id = to_user_id;

    -- Periksa apakah dompet ada
    IF from_wallet_id IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Dompet pengirim tidak ditemukan.';
        RETURN;
    END IF;
    IF to_wallet_id IS NULL THEN
        RETURN QUERY SELECT FALSE, 'Dompet penerima tidak ditemukan.';
        RETURN;
    END IF;

    -- Periksa saldo pengirim
    SELECT balance INTO from_balance FROM public.wallets WHERE id = from_wallet_id;
    IF from_balance < amount_to_transfer THEN
        RETURN QUERY SELECT FALSE, 'Saldo tidak mencukupi.';
        RETURN;
    END IF;

    -- Lakukan transfer
    UPDATE public.wallets
    SET balance = balance - amount_to_transfer
    WHERE id = from_wallet_id;

    UPDATE public.wallets
    SET balance = balance + amount_to_transfer
    WHERE id = to_wallet_id;

    -- Catat transaksi untuk pengirim (pembayaran/penarikan)
    INSERT INTO public.transactions (wallet_id, amount, type, status, related_entity_id)
    VALUES (from_wallet_id, amount_to_transfer, transfer_type, 'completed', related_entity);

    -- Catat transaksi untuk penerima (deposit/payout)
    INSERT INTO public.transactions (wallet_id, amount, type, status, related_entity_id)
    VALUES (to_wallet_id, amount_to_transfer, 
        CASE 
            WHEN transfer_type = 'campaign_payment' THEN 'payout'::transaction_type
            WHEN transfer_type = 'withdrawal' THEN 'withdrawal'::transaction_type -- Seharusnya tidak terjadi, tapi untuk kelengkapan
            ELSE 'deposit'::transaction_type
        END, 
        'completed', related_entity);

    RETURN QUERY SELECT TRUE, 'Transfer berhasil.';

EXCEPTION
    WHEN OTHERS THEN
        -- Jika terjadi error, rollback transaksi
        RAISE NOTICE 'Terjadi kesalahan dalam create_transfer: %', SQLERRM;
        RETURN QUERY SELECT FALSE, 'Terjadi kesalahan internal: ' || SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;