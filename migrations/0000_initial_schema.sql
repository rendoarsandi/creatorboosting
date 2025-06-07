-- Drop tables if they exist to ensure a clean slate
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS campaign_assets;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS profiles;

-- Table: profiles
-- Stores user profile information, linked to Clerk user IDs.
CREATE TABLE profiles (
    id TEXT PRIMARY KEY NOT NULL, -- Clerk User ID
    role TEXT CHECK(role IN ('creator', 'promoter')) NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: wallets
-- Stores the balance for each user.
CREATE TABLE wallets (
    user_id TEXT PRIMARY KEY NOT NULL,
    balance REAL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES profiles(id)
);

-- Table: campaigns
-- Stores information about amplification campaigns created by creators.
CREATE TABLE campaigns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    creator_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    total_budget REAL NOT NULL,
    rate_per_10k_views REAL NOT NULL,
    terms TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES profiles(id)
);

-- Table: campaign_assets
-- Stores links to assets for each campaign (e.g., video files in R2).
CREATE TABLE campaign_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL,
    asset_url TEXT NOT NULL,
    asset_type TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id)
);

-- Table: submissions
-- Tracks videos submitted by promoters for a campaign.
CREATE TABLE submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    campaign_id INTEGER NOT NULL,
    promoter_id TEXT NOT NULL,
    submitted_url TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
    tracked_views INTEGER DEFAULT 0,
    paid_views INTEGER DEFAULT 0,
    last_checked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id),
    FOREIGN KEY (promoter_id) REFERENCES profiles(id)
);

-- Table: transactions
-- Records all financial movements between wallets.
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_wallet_id TEXT,
    to_wallet_id TEXT,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('top-up', 'payment', 'withdrawal', 'fee')),
    status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'failed')),
    submission_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (from_wallet_id) REFERENCES wallets(user_id),
    FOREIGN KEY (to_wallet_id) REFERENCES wallets(user_id),
    FOREIGN KEY (submission_id) REFERENCES submissions(id)
);

-- Indexes for performance
CREATE INDEX idx_campaigns_creator_id ON campaigns(creator_id);
CREATE INDEX idx_submissions_campaign_id ON submissions(campaign_id);
CREATE INDEX idx_submissions_promoter_id ON submissions(promoter_id);
CREATE INDEX idx_transactions_from_wallet_id ON transactions(from_wallet_id);
CREATE INDEX idx_transactions_to_wallet_id ON transactions(to_wallet_id);