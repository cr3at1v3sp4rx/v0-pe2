-- Supabase Migration Summary
-- This file documents the schema and setup for the Proposal Engine

-- Tables created:
-- 1. profiles - User profile data
-- 2. proposals - User proposals with metadata
-- 3. sections - Individual proposal sections with JSONB content
-- 4. templates - Saved proposal templates
-- 5. shares - Client-facing shareable links
-- 6. analytics - Client engagement tracking

-- All tables have Row Level Security (RLS) enabled
-- Users can only access their own data via the RLS policies

-- To complete the migration:
-- 1. Run: scripts/001_create_proposals_schema.sql
-- 2. Run: scripts/003_fix_rls_policies.sql
-- 3. All dashboard, editor, and proposal pages are now connected to Supabase
-- 4. Dummy data has been removed from all pages
-- 5. Real data will load from Supabase on first use
