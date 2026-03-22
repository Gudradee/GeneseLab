# Estudo de Campo — Setup

## 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto gratuito
2. Vá em **SQL Editor** e execute o conteúdo de `supabase/schema.sql`
3. Vá em **Storage > New Bucket**:
   - Name: `project-images`
   - Public: **ON** (marque como público)

## 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Estas chaves estão em: **Supabase > Settings > API**

## 3. Instalar e rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

## 4. Deploy no Vercel

1. Suba o projeto para o GitHub
2. No Vercel, clique em **New Project** e importe o repositório
3. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**

## Funcionalidades

- **Galeria** (`/`): visualiza todos os projetos com busca, filtro e votação
- **Submeter** (`/submit`): formulário para submeter projeto com nome, descrição, participantes, imagem (upload ou URL) e link
- **Votação**: cada navegador pode votar/desvotar em cada projeto uma vez
