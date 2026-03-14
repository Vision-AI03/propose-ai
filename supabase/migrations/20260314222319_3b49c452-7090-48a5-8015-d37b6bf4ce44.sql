ALTER TABLE proposals ADD COLUMN IF NOT EXISTS template_id text DEFAULT 'moderno';
ALTER TABLE proposals ADD COLUMN IF NOT EXISTS html_content text;