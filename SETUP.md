# Setup do App de Controle Financeiro

## 1. Criar um Projeto Supabase

1. Acesse [https://supabase.com](https://supabase.com) e crie uma conta
2. Clique em "Create a new project"
3. Preencha os dados e selecione uma região próxima
4. Aguarde o projeto ser criado (pode levar alguns minutos)

## 2. Configurar o Banco de Dados

1. No dashboard do Supabase, vá para "SQL Editor"
2. Crie uma nova query e execute o seguinte SQL:

```sql
-- Tabela de Categorias
CREATE TABLE categories (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  color      text NOT NULL DEFAULT '#6366f1',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own" ON categories
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Tabela de Despesas
CREATE TABLE expenses (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id  uuid REFERENCES categories(id) ON DELETE SET NULL,
  description  text NOT NULL,
  amount       numeric(12,2) NOT NULL CHECK (amount > 0),
  due_date     date NOT NULL,
  paid_date    date,
  status       text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pago','pendente')),
  month        text NOT NULL,
  notes        text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own" ON expenses
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX expenses_user_month_idx ON expenses(user_id, month);
CREATE INDEX expenses_user_status_idx ON expenses(user_id, status);
```

## 3. Pegar as Credenciais

1. No Supabase, vá para "Settings" → "API"
2. Copie:
   - `NEXT_PUBLIC_SUPABASE_URL` (URL do projeto)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Chave anon)
3. Substitua no arquivo `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<sua-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-chave>
```

## 4. Gerar Ícones PWA

Você precisa criar dois ícones PNG:

- `public/icons/icon-192x192.png` (192x192 px)
- `public/icons/icon-512x512.png` (512x512 px)
- `public/icons/apple-touch-icon.png` (180x180 px)

Dica: Use um gerador online como [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) ou crie um ícone simples com seu logo.

## 5. Rodar Localmente

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 6. Deploy no Vercel

```bash
npm install -g vercel
vercel
```

Siga as instruções. Depois:

1. No dashboard do Vercel, adicione as env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. No Supabase, vá para "Authentication" → "Settings" e adicione sua URL do Vercel em "Redirect URLs":
   - `https://seu-app-producao.vercel.app/auth/callback`

## 7. Instalar no Celular

### Android (Chrome)
1. Abra o app no Chrome
2. Toque no menu (3 pontos)
3. "Instalar app"

### iOS (Safari)
1. Abra o app no Safari
2. Toque no botão de compartilhar (seta para cima)
3. "Adicionar à Tela Inicial"

---

## Próximos Passos (Fase 2)

- [ ] Integração com WhatsApp (chatbot para adicionar despesas)
- [ ] Exportar dados (Excel, PDF)
- [ ] Notificações de contas vencendo
- [ ] Divisão de despesas entre usuários
- [ ] Relatórios mensais/anuais
- [ ] Gráficos avançados por categoria
