# Controle Financeiro - App de Controle de Gastos

Um aplicativo web progressivo (PWA) para controlar suas contas e despesas mensais, acessível tanto no navegador quanto no celular como um aplicativo nativo.

## ✨ Funcionalidades

- **Controle de Despesas**: Adicione, edite e delete suas despesas
- **Categorias Personalizadas**: Crie e organize suas despesas por categorias com cores
- **Dashboard Mensal**: Veja um resumo visual de seus gastos pagos e pendentes
- **Multi-usuário**: Cada usuário vê apenas seus próprios dados
- **PWA**: Instale no celular como um app nativo (sem precisar da App Store)
- **Responsivo**: Funciona perfeitamente no desktop, tablet e celular
- **Offline Ready**: O app continua funcionando mesmo sem conexão (com dados em cache)

## 🚀 Quick Start

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar Supabase

Siga o guia em `SETUP.md` para:
- Criar um projeto Supabase
- Configurar o banco de dados
- Copiar as credenciais para `.env.local`

### 3. Rodar localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no navegador.

### 4. Criar sua conta

- Clique em "Criar Conta"
- Preencha com email e senha
- Acesso ao dashboard automático

## 📱 Instalar no Celular

### Android (Chrome)
1. Abra o app no Chrome
2. Toque no menu (⋮)
3. Selecione "Instalar app"

### iOS (Safari)
1. Abra o app no Safari
2. Toque no botão de compartilhar (⬆️)
3. Selecione "Adicionar à Tela Inicial"

## 📦 Tech Stack

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilos
- **Supabase** - Backend + Autenticação + Banco de dados
- **shadcn/ui** - Componentes de UI
- **react-hook-form + Zod** - Formulários com validação
- **Recharts** - Gráficos
- **next-pwa** - Suporte a PWA

## 🎯 Estrutura do Projeto

```
src/
├── app/                    # Rotas Next.js App Router
│   ├── (auth)/            # Rotas de autenticação
│   ├── (app)/             # Rotas protegidas da app
│   └── page.tsx           # Home (redireciona)
├── components/            # Componentes React
│   ├── ui/                # Componentes shadcn/ui
│   ├── layout/            # Sidebar, TopBar, etc
│   ├── shared/            # Componentes compartilhados
│   ├── dashboard/         # Dashboard
│   ├── expenses/          # Página de despesas
│   └── categories/        # Página de categorias
├── lib/                   # Utilitários e lógica
│   ├── supabase/          # Clientes Supabase
│   ├── actions/           # Server Actions
│   ├── hooks/             # React hooks customizados
│   ├── utils/             # Funções auxiliares
│   └── types/             # Tipos TypeScript
└── middleware.ts          # Proteção de rotas
```

## 🔐 Segurança com Row Level Security

Todas as queries são protegidas com RLS (Row Level Security) do Supabase, garantindo que:
- Cada usuário vê apenas seus próprios dados
- Operações só podem ser feitas no próprio usuário
- Sem chance de acessar dados de outros usuários

## 🚀 Deploy no Vercel

```bash
npm install -g vercel
vercel
```

Depois configure as variáveis de ambiente no dashboard do Vercel com as credenciais Supabase.

## 📝 Próximos Passos (Roadmap)

- [ ] Integração com WhatsApp para adicionar despesas
- [ ] Exportar dados em Excel/PDF
- [ ] Notificações de contas vencendo
- [ ] Divisão de despesas entre usuários
- [ ] Relatórios mensais/anuais
- [ ] Gráficos avançados por categoria
- [ ] Sincronização com banco de dados
- [ ] Modo escuro/claro

## 📄 Licença

MIT - Use livremente!
