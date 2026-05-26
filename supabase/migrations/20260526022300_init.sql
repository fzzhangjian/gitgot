-- GitGot Database Schema
-- Run this in Supabase SQL Editor

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_zh TEXT NOT NULL,
  name_en TEXT,
  slug TEXT NOT NULL UNIQUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Solutions (main table)
CREATE TABLE solutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title_zh TEXT NOT NULL,
  title_en TEXT,
  description_zh TEXT NOT NULL,
  description_en TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  source_platform TEXT,
  source_url TEXT,
  source_author TEXT,
  verified BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects in each solution
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solution_id UUID NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  github_url TEXT NOT NULL,
  project_name TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Many-to-many: solutions <-> tags
CREATE TABLE solution_tags (
  solution_id UUID NOT NULL REFERENCES solutions(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (solution_id, tag_id)
);

-- Indexes
CREATE INDEX idx_solutions_published ON solutions(published) WHERE published = true;
CREATE INDEX idx_solutions_published_at ON solutions(published_at DESC) WHERE published = true;
CREATE INDEX idx_solutions_category ON solutions(category_id);
CREATE INDEX idx_projects_solution ON projects(solution_id);
CREATE INDEX idx_solution_tags_solution ON solution_tags(solution_id);
CREATE INDEX idx_solution_tags_tag ON solution_tags(tag_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER solutions_updated_at
  BEFORE UPDATE ON solutions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Seed categories
INSERT INTO categories (slug, name_zh, name_en, sort_order) VALUES
  ('ai-ml', 'AI / 机器学习', 'AI / Machine Learning', 1),
  ('dev-tools', '开发工具', 'Dev Tools', 2),
  ('automation', '效率 & 自动化', 'Automation & Productivity', 3),
  ('web-dev', 'Web 开发', 'Web Development', 4),
  ('data-viz', '数据 & 可视化', 'Data & Visualization', 5),
  ('self-hosting', '自部署 / 私有化', 'Self-Hosting', 6),
  ('mobile', '移动开发', 'Mobile Development', 7),
  ('other', '其他', 'Other', 99);
