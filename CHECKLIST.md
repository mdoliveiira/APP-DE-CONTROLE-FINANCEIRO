# ✅ Checklist - App de Controle Financeiro

## 🔧 Configuração Inicial

- [ ] Ler `GETTING_STARTED.md` para entender os passos
- [ ] Criar conta Supabase em [supabase.com](https://supabase.com)
- [ ] Executar SQL do banco de dados (copiar de `SETUP.md`)
- [ ] Adicionar credenciais em `.env.local`
- [ ] Testar dev server: `npm run dev`

## 🎨 Customização (Opcional)

- [ ] Adicionar ícones em `public/icons/`
- [ ] Ajustar cores no `tailwind.config.ts` (se desejar)
- [ ] Atualizar nome do app em `manifest.json`

## 🧪 Testes Locais

- [ ] Criar conta no app
- [ ] Criar categorias
- [ ] Adicionar despesa
- [ ] Editar despesa
- [ ] Marcar despesa como paga
- [ ] Deletar despesa
- [ ] Deletar categoria
- [ ] Ver dashboard com dados
- [ ] Navegar entre meses
- [ ] Testar em celular (localhost:3000)
- [ ] Verificar que outro usuário não vê seus dados (criar segunda conta)

## 🚀 Antes de Deploy

- [ ] Testar em modo incógnito (limpar cache)
- [ ] Checar console do navegador (sem erros)
- [ ] Testar formulários com dados inválidos
- [ ] Testar logout e novo login
- [ ] Build local: `npm run build` ✅ (já testado)

## 🌐 Deploy no Vercel

- [ ] Fazer deploy: `vercel`
- [ ] Configurar variáveis de ambiente no Vercel
- [ ] Atualizar Redirect URLs no Supabase
- [ ] Testar app em produção
- [ ] Compartilhar link com esposa
- [ ] Criar segunda conta para teste

## 📱 Instalação no Celular

- [ ] Testar "Instalar app" no Android
- [ ] Testar "Adicionar à Tela Inicial" no iOS
- [ ] Usar app instalado (verificar se funciona)

## 🔐 Segurança

- [ ] Verificar que RLS está ativado no Supabase
- [ ] Testar que dados de um usuário não são acessíveis para outro
- [ ] Usar senha forte (recomendado)
- [ ] Ativar autenticação 2FA no Supabase (opcional)

## 📚 Documentação

- [ ] Ler `README.md` para visão geral
- [ ] Consultar `SETUP.md` para configuração
- [ ] Consultar `GETTING_STARTED.md` para começar

## 🚀 Próximas Fases

### Fase 2 - Integração WhatsApp
- [ ] Criar chatbot que recebe mensagens
- [ ] Parser de mensagens como "gastei 100 de gasolina"
- [ ] Salvar automaticamente no banco

### Fase 3 - Relatórios
- [ ] Exportar dados em Excel
- [ ] Gerar PDF com resumo mensal
- [ ] Gráficos por período

### Fase 4 - Recursos Avançados
- [ ] Compartilhamento de despesas
- [ ] Sincronização com banco de dados
- [ ] Notificações de vencimento
- [ ] Modo escuro/claro

---

## ⚡ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Iniciar servidor local

# Build e Deploy
npm run build            # Compilar para produção
vercel                   # Deploy no Vercel

# Limpeza
npm install             # Reinstalar dependências
rm -rf .next            # Limpar cache de build
```

## 📞 Suporte

Se encontrar algum erro:

1. Verifique a seção "Dúvidas Comuns" em `GETTING_STARTED.md`
2. Consulte o console do navegador (F12)
3. Verifique os logs do servidor (npm run dev)
4. Verifique `.env.local` com credenciais corretas
5. Verifique que as tabelas foram criadas no Supabase

---

**Data de Criação**: 2026-05-08  
**Status**: ✅ Pronto para usar  
**Última Atualização**: 2026-05-08
