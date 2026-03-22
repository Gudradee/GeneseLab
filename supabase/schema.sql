-- =============================================
-- Estudo de Campo - LEIbmec
-- Execute este SQL no Supabase SQL Editor
-- =============================================

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  participants TEXT NOT NULL,
  image_url TEXT,
  project_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de votos (unique por projeto + voter)
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  voter_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, voter_id)
);

-- Habilitar RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Políticas permissivas (acesso público para hackathon)
CREATE POLICY "Leitura pública de projetos" ON projects FOR SELECT USING (true);
CREATE POLICY "Inserção pública de projetos" ON projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Leitura pública de votos" ON votes FOR SELECT USING (true);
CREATE POLICY "Inserção pública de votos" ON votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Remoção pública de votos" ON votes FOR DELETE USING (true);

-- =============================================
-- Storage: Crie um bucket chamado "project-images"
-- Em Storage > New Bucket > Name: project-images > Public: ON
-- =============================================
