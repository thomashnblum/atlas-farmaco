-- ATLAS FÁRMACO - SUPABASE SCHEMA INITIALIZATION
-- Execute este script no SQL Editor do seu projeto Supabase

-- 1. Create Molecules Table
CREATE TABLE IF NOT EXISTS molecules (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    trade_names TEXT[] DEFAULT '{}',
    class TEXT NOT NULL,
    clinical_axes TEXT[] DEFAULT '{}',
    mechanisms TEXT,
    notes TEXT,
    side_effects TEXT[] DEFAULT '{}',
    contraindications TEXT[] DEFAULT '{}',
    routes TEXT[] DEFAULT '{}',
    psychiatry_use TEXT,
    off_label_uses JSONB DEFAULT '[]'::jsonb,
    on_label_uses JSONB DEFAULT '[]'::jsonb,
    profile_symbols TEXT[] DEFAULT '{}'
);

-- 2. Create Receptors Table
CREATE TABLE IF NOT EXISTS receptors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT,
    neurotransmitter_system TEXT,
    description TEXT
);

-- 3. Create Enzymes Table
CREATE TABLE IF NOT EXISTS enzymes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    location TEXT
);

-- 4. Create Pharmacodynamics (PD) Interactions Table
CREATE TABLE IF NOT EXISTS pd_interactions (
    molecule_id TEXT REFERENCES molecules(id) ON DELETE CASCADE,
    receptor_id TEXT REFERENCES receptors(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    affinity_ki NUMERIC,
    notes TEXT,
    sources TEXT[] DEFAULT '{}',
    PRIMARY KEY (molecule_id, receptor_id)
);

-- 5. Create Pharmacokinetics (PK) Interactions Table
CREATE TABLE IF NOT EXISTS pk_interactions (
    molecule_id TEXT REFERENCES molecules(id) ON DELETE CASCADE,
    enzyme_id TEXT REFERENCES enzymes(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    notes TEXT,
    sources TEXT[] DEFAULT '{}',
    PRIMARY KEY (molecule_id, enzyme_id)
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE molecules ENABLE ROW LEVEL SECURITY;
ALTER TABLE receptors ENABLE ROW LEVEL SECURITY;
ALTER TABLE enzymes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pd_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pk_interactions ENABLE ROW LEVEL SECURITY;

-- Create Policies to allow public read access to all authenticated and anonymous users
CREATE POLICY "Public read access on molecules" ON molecules FOR SELECT USING (true);
CREATE POLICY "Public read access on receptors" ON receptors FOR SELECT USING (true);
CREATE POLICY "Public read access on enzymes" ON enzymes FOR SELECT USING (true);
CREATE POLICY "Public read access on pd_interactions" ON pd_interactions FOR SELECT USING (true);
CREATE POLICY "Public read access on pk_interactions" ON pk_interactions FOR SELECT USING (true);
