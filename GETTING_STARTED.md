# 🚀 Começando com o App de Controle Financeiro

Parabéns! Seu aplicativo foi criado com sucesso. Siga estes passos para começar:

## ⚡ Passo 1: Configurar Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Crie uma conta gratuita (se não tiver)
3. Crie um novo projeto
4. Copie suas credenciais do painel "Settings" → "API":
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Abra `.env.local` e substitua os valores:
   ```
   NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
   ```

## 📊 Passo 2: Criar as Tabelas do Banco de Dados

1. No Supabase, vá para "SQL Editor"
2. Crie uma nova query
3. **Cole o SQL completo** do arquivo `SETUP.md` (seção "Configurar o Banco de Dados")
4. Clique em "Run"

**Importante**: Você precisa executar TODO o SQL de uma vez para criar as tabelas e as políticas de RLS.

## 🎨 Passo 3: Adicionar Ícones do Aplicativo (Opcional)

Para que o app funcione 100% como PWA, adicione ícones PNG em:
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`
- `public/icons/apple-touch-icon.png` (180x180)

**Dica**: Use um gerador online como [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) ou crie um ícone simples com seu designer.

## 🏃 Passo 4: Rodar Localmente

```bash
npm run dev
```

Abra no navegador: **http://localhost:3000**

### Teste o fluxo:
1. ✅ Clique em "Criar Conta"
2. ✅ Preencha com email e senha
3. ✅ Você será redirecionado ao dashboard
4. ✅ Crie uma categoria (aba "Categorias")
5. ✅ Crie uma despesa (aba "Contas")
6. ✅ Marque como pago
7. ✅ Veja o resumo no dashboard

## 🚀 Passo 5: Deploy no Vercel

```bash
npm install -g vercel
vercel
```

Siga as instruções no terminal.

### Após fazer deploy:

1. No Vercel, adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. No Supabase, vá para "Authentication" → "Settings"
3. Em "Site URL", coloque sua URL do Vercel
4. Em "Redirect URLs", adicione:
   ```
   https://seu-app.vercel.app/auth/callback
   ```

## 📱 Passo 6: Instalar no Celular

### Android (Chrome)
1. Abra o app no Chrome
2. Menu (⋮) → "Instalar app"

### iOS (Safari)
1. Abra no Safari
2. Compartilhar (⬆️) → "Adicionar à Tela Inicial"

## ✨ Próximos Passos Recomendados

- [ ] Compartilhe o link com sua esposa para que ela crie sua conta
- [ ] Customize as categorias com as despesas que vocês têm
- [ ] Adicione todos os gastos do mês anterior
- [ ] Configure lembretes no seu celular para adicionar despesas
- [ ] (Futura) Integração com WhatsApp para adicionar despesas automaticamente

## 🆘 Dúvidas Comuns

**P: Esqueci minha senha**
R: Na tela de login, haverá uma opção "Esqueci a senha" (ainda não implementada - use Supabase dashboard para resetar).

**P: Posso usar em mais de um celular?**
R: Sim! Todas as contas sincronizam pela nuvem. Basta fazer login com a mesma conta.

**P: Os dados são seguros?**
R: Sim! Usamos Supabase com criptografia e Row Level Security (RLS) para garantir que cada usuário vê apenas seus dados.

**P: Funciona offline?**
R: Parcialmente. O app carrega, mas sem internet você não pode fazer mudanças. As mudanças sincronizam quando voltar online.

## 📞 Precisa de Ajuda?

Consulte:
- `README.md` - Visão geral do projeto
- `SETUP.md` - Configuração detalhada
- `src/` - Código fonte bem organizado

---

**Bom uso! 🎉**
