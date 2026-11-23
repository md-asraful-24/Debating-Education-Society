-- ========================================================
-- Debating Education Society in Bangladesh (DESB)
-- Supabase / PostgreSQL Schema Definition
-- ========================================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'kicked', 'banned')),
    team_id TEXT,
    panel_role TEXT CHECK (panel_role IN ('chairperson', 'vice_chairperson', 'panel_member', 'debater', 'audience')),
    avatar TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OTP Verifications
CREATE TABLE IF NOT EXISTS otp_verifications (
    email TEXT PRIMARY KEY,
    otp TEXT NOT NULL,
    expires_at BIGINT NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    created_at BIGINT NOT NULL
);

-- Sliders
CREATE TABLE IF NOT EXISTS sliders (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title JSONB NOT NULL,
    subtitle JSONB NOT NULL,
    show_overlay BOOLEAN NOT NULL DEFAULT TRUE,
    "order" INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Debates
CREATE TABLE IF NOT EXISTS debates (
    id TEXT PRIMARY KEY,
    topic JSONB NOT NULL,
    category JSONB,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    meet_link TEXT NOT NULL,
    unlock_minutes_before INT NOT NULL DEFAULT 6,
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    team_a JSONB NOT NULL,
    team_b JSONB NOT NULL,
    judges JSONB NOT NULL DEFAULT '[]'::jsonb,
    result JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT NOT NULL,
    sender_id TEXT NOT NULL REFERENCES users(id),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    panel_role TEXT,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Settings
CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    site_name JSONB NOT NULL,
    theme TEXT NOT NULL DEFAULT 'emerald',
    official_gmail TEXT NOT NULL,
    phone TEXT NOT NULL,
    address JSONB NOT NULL,
    facebook_url TEXT,
    about_content JSONB NOT NULL,
    terms_of_service JSONB NOT NULL,
    conduct_rules JSONB NOT NULL,
    leadership JSONB NOT NULL DEFAULT '[]'::jsonb,
    debate_resources JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE debates ENABLE ROW LEVEL SECURITY;

-- Indexing for high-speed queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_chat_channel ON chat_messages(channel_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_debates_scheduled ON debates(scheduled_at);
