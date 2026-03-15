-- Add note column to occasions (required for birthday sync and duplicate detection)
-- Run in Supabase → SQL Editor → New Query → Run

ALTER TABLE occasions ADD COLUMN IF NOT EXISTS note text;
